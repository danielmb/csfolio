/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { observable } from "@trpc/server/observable";
import { TRPCError } from "@trpc/server";
import { RedisStream } from "@/lib/stream";
import { Prisma } from "@prisma/client";

export const messageEvent = z.object({
  type: z.literal("message"),
  userId: z.string(),
  messageId: z.string(),
});
export type MessageEvent = z.infer<typeof messageEvent>;
const testEvent = z.object({
  type: z.literal("test"),
  message: z.string(),
});
export const connectedEvent = z.object({
  type: z.literal("connected"),
  userId: z.string(),
});
export type ConnectedEvent = z.infer<typeof connectedEvent>;
export const disconnectedEvent = z.object({
  type: z.literal("disconnected"),
  userId: z.string(),
});
export type DisconnectedEvent = z.infer<typeof disconnectedEvent>;
export const conversationEvents = messageEvent
  .or(testEvent)
  .or(connectedEvent)
  .or(disconnectedEvent);
export type ConversationEvents = z.infer<typeof conversationEvents>;
export type ConversationEventsType = ConversationEvents["type"];

export const messageEventToClient = z.object({
  type: z.literal("message"),
  message: z.object({
    conversationId: z.string(),
    id: z.string(),
    message: z.string(),
    senderId: z.string(),
    sender: z.object({
      id: z.string(),
      name: z.string().nullable(),
      image: z.string().nullable(),
    }),
    seenBy: z.array(
      z.object({
        id: z.string(),
        name: z.string().nullable(),
        image: z.string().nullable(),
      }),
    ),
    createdAt: z.string(),
  }),
  cursor: z.string().nullish(),
});
export const conversationEventsToClient = messageEventToClient;
export type ConversationEventsToClient = z.infer<
  typeof conversationEventsToClient
>;
export type ConversationEventsToClientType = ConversationEventsToClient["type"];

const messageInclude = {
  seenBy: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  sender: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} as const satisfies Prisma.MessageInclude;

export const messageRouter = createTRPCRouter({
  joinConversation: protectedProcedure
    .input(z.string())
    .subscription(async ({ ctx: { db, session }, input }) => {
      const conversation = await db.conversation.findUnique({
        where: {
          id: input,
          participants: {
            some: {
              id: session.user.id,
            },
          },
        },
      });
      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }
      return observable<ConversationEventsToClient>((observer) => {
        const data = new RedisStream().redis;
        const channelName = `conversation:${input}`;
        data
          .subscribe(channelName, (err) => {
            if (err) {
              observer.error(err);
            }
          })
          .catch((err) => {
            observer.error(err);
          });
        data.on("connect", () => {
          // observer.next("connected");
          // observer.next({
          //   type: "connected",
          //   userId: session.user.id,
          // });
        });
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        data.on("message", async (channel, message) => {
          // observer.next(message);
          // turn message to object
          let event: ConversationEvents;
          try {
            event = conversationEvents.parse(JSON.parse(message));
          } catch (err) {
            observer.error(err);
            return;
          }
          // on message
          if (event.type === "message") {
            const message = await db.message.findUnique({
              where: {
                id: event.messageId,
              },
              include: messageInclude,
            });
            if (!message) {
              observer.error(new Error("Message not found"));
              return;
            }
            observer.next({
              type: "message",
              message: {
                conversationId: message.conversationId,
                id: message.id,
                message: message.message,
                senderId: message.senderId,
                sender: {
                  id: message.sender.id,
                  name: message.sender.name,
                  image: message.sender.image,
                },
                seenBy: message.seenBy.map((user) => ({
                  id: user.id,
                  name: user.name,
                  image: user.image,
                })),
                createdAt: message.createdAt.toISOString(),
              },
            });
          }
        });

        return () => {
          data.quit().catch((err) => {
            observer.error(err);
          });
        };
      });
    }),

  getConversation: protectedProcedure
    .input(z.string())
    .query(async ({ ctx: { db, session }, input }) => {
      return db.conversation.findUnique({
        where: {
          id: input,
          participants: {
            some: {
              // Basically a permission check
              id: session.user.id,
            },
          },
        },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),
  messages: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx: { db, session }, input }) => {
      const messages = await db.message.findMany({
        where: {
          conversationId: input.conversationId,
        },
        include: messageInclude,
        orderBy: {
          createdAt: "desc",
        },
        take: 11,
        cursor: input.cursor
          ? {
              id: input.cursor,
            }
          : undefined,
      });

      const cursor = messages.pop()?.id;

      return {
        messages,
        cursor,
      };
    }),
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx: { db, session }, input }) => {
      const conversation = await db.conversation.findUnique({
        where: {
          id: input.conversationId,
          participants: {
            some: {
              id: session.user.id,
            },
          },
        },
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      if (!input.message) {
        throw new Error("Message can't be empty");
      }

      // emit

      const message = await db.message.create({
        data: {
          conversationId: input.conversationId,
          message: input.message,
          senderId: session.user.id,
        },
        include: messageInclude,
      });
      const redis = new RedisStream().redis;
      const channelName = `conversation:${input.conversationId}`;
      await redis
        .publish(
          channelName,
          JSON.stringify({
            messageId: message.id,
            userId: session.user.id,
            type: "message",
          } satisfies MessageEvent),
        )
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          redis.quit().catch((err) => {
            throw err;
          });
        });
      return message;
    }),
  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      // const conversation = await db.conversation.findUnique({
      //   where: {
      //     id: input,
      //     participants: {
      //       some: {
      //         id: session.user.id,
      //       },
      //     },
      //   },
      // });
      const message = await db.message.update({
        data: {
          seenBy: {
            connect: {
              id: session.user.id,
            },
          },
        },
        where: {
          id: input.messageId,
        },
      });
      return true;
    }),
  getOrCreatePrivateConversation: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const user = await db.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const conversation = await db.conversation.findFirst({
        where: {
          participants: {
            some: {
              id: session.user.id,
            },
          },
          AND: {
            participants: {
              some: {
                id: input.userId,
              },
            },
          },
        },
      });

      if (conversation) {
        return conversation;
      }

      return db.conversation.create({
        data: {
          participants: {
            connect: [{ id: session.user.id }, { id: input.userId }],
          },
        },
      });
    }),
  newConversation: protectedProcedure
    .input(z.object({ userIds: z.array(z.string()) }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      // check if user are friends
      const areFriends = await db.user.findMany({
        where: {
          id: {
            in: input.userIds,
          },
          friends: {
            some: {
              id: session.user.id,
            },
          },
          friendsOf: {
            some: {
              id: session.user.id,
            },
          },
        },
      });

      if (!areFriends) {
        throw new Error("You can only start a conversation with friends");
      }

      return db.conversation.create({
        data: {
          participants: {
            connect: [
              { id: session.user.id },
              ...input.userIds.map((id) => ({ id })),
            ],
          },
        },
      });
    }),

  getConversations: protectedProcedure.query(({ ctx: { db, session } }) => {
    return db.conversation.findMany({
      include: {
        participants: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
    });
  }),
});
