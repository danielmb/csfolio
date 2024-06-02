import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { z } from "zod";

export const notificationsRouter = createTRPCRouter({
  getNotifications: protectedProcedure.query(
    async ({ ctx: { db, session } }) => {
      if (!session.user) throw new Error("User not found");
      const notifications = await db.notification.findMany({
        where: {
          userId: session.user.id,
        },
      });
      return notifications;
    },
  ),
  readNotification: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const userId = session.user.id;
      await db.notification.update({
        where: {
          userId,
          id: input.id,
        },
        data: {
          read: true,
        },
      });
      return true;
    }),

  removeNotification: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db, session }, input }) => {
      const userId = session.user.id;
      if (!userId) throw new Error("User not found");
      await db.notification
        .delete({
          where: {
            userId,
            id: input.id,
          },
        })
        .catch((e) => {
          console.error(e);
          throw new Error("Failed to delete notification");
        });
    }),
});
