import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { observable } from "@trpc/server/observable";
import { randomUUID } from "crypto";
export const activeSessions = new Map<string, Set<string>>();
export const sessionRouter = createTRPCRouter({
  // usersOnline: publicProcedure
  initSession: protectedProcedure
    .input(z.number())
    .subscription(({ ctx: { session } }) => {
      return observable<string>((observer) => {
        // const sessionId = randomUUID();
        // console.log("initSession", sessionId);
        // const active = activeSessions.get(session.user.id) ?? new Set();
        // active.add(sessionId);
        // activeSessions.set(session.user.id, active);
        // observer.next(sessionId);
        const sessionId = randomUUID();
        const active = activeSessions.get(session.user.id) ?? new Set();
        active.add(sessionId);
        activeSessions.set(session.user.id, active);
        observer.next(session.user.id);
        return () => {
          const active = activeSessions.get(session.user.id);
          if (active) {
            // active.delete(sessionId);
            if (active.size === 0) {
              activeSessions.delete(session.user.id);
            }
          }
        };
      });
    }),
  usersOnline: publicProcedure.query(async ({ ctx: { db } }) => {
    // const onlineUsers = Array.from(activeSessions.keys());
    const onlineUsers = Array.from(activeSessions.keys());
    const users = await db.user.findMany({
      where: {
        id: {
          in: onlineUsers,
        },
      },
    });
    return users;
  }),
  friendOnline: protectedProcedure.query(async ({ ctx: { session, db } }) => {
    const friends = await db.user.findMany({
      where: {
        OR: [
          {
            friends: {
              some: {
                id: session.user.id,
              },
            },
          },
          {
            friendsOf: {
              some: {
                id: session.user.id,
              },
            },
          },
        ],
      },
    });
    const friendIds = friends.map((friend) => friend.id);
    const onlineFriends = friendIds.filter((id) => activeSessions.has(id));
    return onlineFriends;
  }),
});
