/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import EventEmitter from "events";
import type TypedEmitter from "typed-emitter";
import { observable } from "@trpc/server/observable";
import { TRPCError } from "@trpc/server";
import { RouterOutputs } from "@/trpc/react";
import { randomUUID } from "crypto";
type DBMessage = RouterOutputs["message"]["messages"]["messages"][number];
export type MessageEvents = {
  typing: (userId: string, remove?: boolean) => void;
  message: (message: DBMessage) => void;
  userJoined: (userId: string) => void;
  userLeft: (userId: string) => void;
};
export type MessageEventsMap = {
  typing?: {
    userId: string;
    remove?: boolean;
  };
  message?: DBMessage;
  userJoined?: string;
  userLeft?: string;
};

type ActiveParticipants = Map<string, Set<string>>; // list of active participants in a conversation, also their session ids. So we can track who is in a conversation
export interface LiveConversationData {
  // activeParticipants: Set<Set<string>>;
  activeParticipants: ActiveParticipants;
  typing: Set<string>;
}

export interface ConversationDataWithEmitter extends LiveConversationData {
  emitter: TypedEmitter<MessageEvents>;
}
// export const messageEvents = new EventEmitter() as TypedEmitter<MessageEvents>;
const getConversation = (
  conversationId: string,
  userId?: string,
  uuid?: string,
) => {
  const conversation = messageMap.get(conversationId) ?? {
    activeParticipants: new Map(),
    typing: new Set(),
    emitter: new EventEmitter() as TypedEmitter<MessageEvents>,
  };
  if (userId && uuid) {
    const active = conversation.activeParticipants.get(userId) ?? new Set();
    // if length is 0, it means the user just joined the conversation
    if (active.size === 0) {
      conversation.emitter.emit("userJoined", userId);
    }
    if (!active.has(uuid)) {
      active.add(uuid);
    }
    conversation.activeParticipants.set(userId, active);
  }
  messageMap.set(conversationId, conversation);
  // if the user just joined the conversation

  return conversation;
};

export const messageMap = new Map<string, ConversationDataWithEmitter>();
export const messageRouter = createTRPCRouter({
  initConversation: protectedProcedure
    .input(z.string())
    .subscription(({ input, ctx: { session } }) => {
      return observable<LiveConversationData>((observer) => {
        // const emitter = new EventEmitter() as TypedEmitter<MessageEvents>;

        // const data = messageMap.get(input) ?? {
        //   activeParticipants: new Set(),
        //   typing: new Set(),
        //   emitter: new EventEmitter() as TypedEmitter<MessageEvents>,
        // };
        // data.activeParticipants.add(session.user.id);
        // messageMap.set(input, data);
        const uuid = randomUUID();
        const data = getConversation(input, session.user.id, uuid);
        // data.activeParticipants.add(session.user.id);

        data.emitter.on("typing", (userId, remove) => {
          if (remove) {
            data.typing.delete(userId);
            return observer.next({
              activeParticipants: data.activeParticipants,
              typing: data.typing,
            });
          }
          data.typing.add(userId);
          observer.next({
            activeParticipants: data.activeParticipants,
            typing: data.typing,
          });
          setTimeout(() => {
            data.typing.delete(userId);
            observer.next({
              activeParticipants: data.activeParticipants,
              typing: data.typing,
            });
          }, 10000);
        });
        data.emitter.on("userJoined", () => {
          observer.next({
            activeParticipants: data.activeParticipants,
            typing: data.typing,
          });
        });
        data.emitter.on("userLeft", () => {
          observer.next({
            activeParticipants: data.activeParticipants,
            typing: data.typing,
          });
        });

        return () => {
          const data = messageMap.get(input);
          if (data) {
            const active = data.activeParticipants.get(session.user.id);
            if (active) {
              active.delete(uuid);
              if (active.size === 0) {
                data.activeParticipants.delete(session.user.id);
                data.emitter.emit("userLeft", session.user.id);
              }
            }
            if (data.activeParticipants.size === 0) {
              messageMap.delete(input);
            }
          }
        };
      });
    }),
  events: protectedProcedure
    .input(z.string())
    .subscription(({ input, ctx: { session } }) => {
      return observable<MessageEventsMap>((observer) => {
        // get the emitter
        const data = getConversation(input);
        const emitter = data.emitter;
        emitter.on("typing", (userId, remove) => {
          observer.next({
            typing: {
              userId,
              remove,
            },
          });
        });
        emitter.on("message", (message) => {
          observer.next({
            message: message,
          });
        });
        return () => {
          emitter?.removeAllListeners();
        };
      });
    }),
  sendTyping: protectedProcedure
    // .input(z.string())
    .input(
      z.object({
        conversationId: z.string(),
        typing: z.boolean().default(false),
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      // const data = messageMap.get(input.conversationId);
      const data = getConversation(input.conversationId);
      if (!data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Conversation is not initialized, the devil is in the details",
        });
      }

      data.emitter.emit("typing", session.user.id, !input.typing);
      return true;
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
        include: {
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
        },
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
        include: {
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
        },
      });
      messageMap.get(input.conversationId)?.emitter.emit("message", message);
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
