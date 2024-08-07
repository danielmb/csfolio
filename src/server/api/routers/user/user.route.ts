import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { type Prisma } from "@prisma/client";
import { z } from "zod";
import { activeSessions } from "../session/session.router";

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async ({ ctx: { db } }) => {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        steamId: true,
      },
    });
    return users;
  }),
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx: { db, session }, input }) => {
      const userId = session.user.id;
      const user = await db.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          image: true,
          steamId: true,
          friends: {
            select: {
              name: true,
              id: true,
            },
          },
          friendsOf: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return {
        ...user,
        isFriend: user.friends.some((friend) => friend.id === userId),
        isOnline: activeSessions.has(user.id),
      };
    }),

  getFriends: protectedProcedure
    .input(
      z
        .object({
          id: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx: { db, session }, input }) => {
      const userId = input?.id ?? session.user.id;
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          friends: {
            select: {
              id: true,
              name: true,
              image: true,
              steamId: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user.friends.map((friend) => ({
        ...friend,
        isOnline: activeSessions.has(friend.id),
      }));
    }),

  removeFriend: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const userId = session.user.id;
      const friendId = input.id;
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          friendsOf: {
            select: {
              id: true,
            },
          },
          friends: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const isFriendOf = user.friendsOf.some(
        (friend) => friend.id === friendId,
      );
      const isFriend = user.friends.some((friend) => friend.id === friendId);
      // if (!user.friends.some((friend) => friend.id === friendId)) {
      //   throw new Error("Friend not found");
      // }
      if (!isFriend && !isFriendOf) {
        throw new Error("Friend not found");
      }
      const isFriendDisconnect: Prisma.UserUpdateArgs["data"] = {
        friends: {
          disconnect: {
            id: friendId,
          },
        },
      };
      const isFriendOfDisconnect: Prisma.UserUpdateArgs["data"] = {
        friendsOf: {
          disconnect: {
            id: friendId,
          },
        },
      };
      const { name } = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          ...isFriendDisconnect,
          ...isFriendOfDisconnect,
        },
        select: {
          name: true,
        },
      });
      await db.notification.create({
        data: {
          userId: friendId,
          message: `You have been removed by ${name}`,
          link: `/profile/${userId}`,
          type: "FRIEND_REMOVED",
        },
      });
      return true;
    }),

  getFriendRequestById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx: { db, session }, input }) => {
      const friendRequest = await db.friendRequest.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!friendRequest) {
        throw new Error("Friend request not found");
      }
      return {
        ...friendRequest,
        isToMe: friendRequest.userIdTo === session.user.id,
      };
    }),
  removeFriendRequest: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const userId = session.user.id;
      const friendRequestId = input.id;
      const friendRequest = await db.friendRequest.findFirst({
        where: {
          id: friendRequestId,
          userIdFrom: userId,
        },
      });
      if (!friendRequest) {
        throw new Error("Friend request not found");
      }
      const deletedFriendRequest = await db.friendRequest.delete({
        where: {
          id: friendRequestId,
        },
        select: {
          notificationId: true,
        },
      });
      await db.notification
        .delete({
          where: {
            id: deletedFriendRequest.notificationId,
          },
        })
        .catch(console.error);
      return true;
    }),
  rejectFriendRequest: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const userId = session.user.id;
      const friendRequestId = input.id;
      const friendRequest = await db.friendRequest.findFirst({
        where: {
          id: friendRequestId,
          userIdTo: userId,
        },
      });
      if (!friendRequest) {
        throw new Error("Friend request not found");
      }
      const deletedFriendRequest = await db.friendRequest.delete({
        where: {
          id: friendRequestId,
        },
        select: {
          notificationId: true,
          to: {
            select: {
              name: true,
            },
          },
        },
      });
      await db.notification
        .delete({
          where: {
            id: deletedFriendRequest.notificationId,
          },
        })
        .catch(console.error);
      await db.notification.create({
        data: {
          userId: friendRequest.userIdFrom,
          message:
            "Your friend request to " +
            deletedFriendRequest.to.name +
            " was rejected",
          link: `/profile/${userId}`,
          type: "FRIEND_REJECTED",
        },
      });
      return true;
    }),

  getFriendRequest: protectedProcedure
    .input(z.object({ userIdTo: z.string() }))
    .query(async ({ ctx: { db, session }, input }) => {
      const userId = session.user.id;
      const friendId = input.userIdTo;
      const friendRequest = await db.friendRequest.findFirst({
        where: {
          OR: [
            {
              userIdFrom: userId,
              userIdTo: friendId,
            },
            {
              userIdFrom: friendId,
              userIdTo: userId,
            },
          ],
        },
      });
      if (!friendRequest) {
        return null;
      }
      const isToMe = friendRequest.userIdTo === userId;
      return {
        ...friendRequest,
        isSentByMe: friendRequest?.userIdFrom === userId,
        isToMe,
      };
    }),
  acceptFriendRequest: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const userId = session.user.id;
      const friendRequestId = input.id;
      const friendRequest = await db.friendRequest.findFirst({
        where: {
          id: friendRequestId,
          userIdTo: userId,
        },
        select: {
          userIdFrom: true,
          to: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!friendRequest) {
        throw new Error("Friend request not found");
      }
      await db.friendRequest.update({
        where: {
          id: friendRequestId,
        },
        data: {
          accepted: true,
        },
      });
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          friends: {
            connect: {
              id: friendRequest.userIdFrom,
            },
          },
        },
      });
      await db.user.update({
        where: {
          id: friendRequest.userIdFrom,
        },
        data: {
          friends: {
            connect: {
              id: userId,
            },
          },
        },
      });
      const deletedFriendRequest = await db.friendRequest.delete({
        where: {
          id: friendRequestId,
        },
        select: {
          notificationId: true,
        },
      });
      await db.notification
        .delete({
          where: {
            id: deletedFriendRequest.notificationId,
          },
        })
        .catch(console.error);

      await db.notification.create({
        data: {
          userId: friendRequest.userIdFrom,
          message:
            "Your friend request to " + friendRequest.to.name + " was accepted",
          link: `/profile/${userId}`,
          type: "FRIEND_ACCEPTED",
        },
      });
      return true;
    }),

  sendFriendRequest: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const loggedInUserId = session.user.id;
      const friendId = input.id;
      const user = await db.user.findUnique({
        where: {
          id: loggedInUserId,
        },
        select: {
          friends: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      if (user.friends.some((friend) => friend.id === friendId)) {
        throw new Error("Friend already added");
      }
      const friendRequest = await db.friendRequest.findFirst({
        where: {
          OR: [
            {
              userIdFrom: loggedInUserId,
              userIdTo: friendId,
            },
            {
              userIdFrom: friendId,
              userIdTo: loggedInUserId,
            },
          ],
        },
      });
      if (friendRequest) {
        throw new Error("Friend request already sent");
      }

      const notification = await db.notification.create({
        data: {
          userId: friendId,
          message: "You have a new friend request",
          link: `/profile/${loggedInUserId}`,
          type: "FRIEND_REQUEST",
        },
      });

      await db.friendRequest.create({
        data: {
          accepted: false,
          userIdFrom: loggedInUserId,
          userIdTo: friendId,
          // create: {
          //   message: "You have a new friend request",
          //   link: `/profile/${loggedInUserId}`,
          //   userId: friendId,
          // },
          notificationId: notification.id,
        },
      });
      return true;
    }),

  friendRequests: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    const friendRequests = await db.friendRequest.findMany({
      where: {
        userIdTo: session.user.id,
        accepted: false,
      },
      select: {
        id: true,
        userIdFrom: true,
      },
    });
    return friendRequests;
  }),
});
