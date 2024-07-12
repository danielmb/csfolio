import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { transactionRouter } from "./routers/transaction";
import { userRouter } from "./routers/user/user.route";
import { notificationsRouter } from "./routers/notifications/notifications.router";
import { messageRouter } from "./routers/message/message.router";
import { sessionRouter } from "./routers/session/session.router";
import { testRouter } from "./routers/test/test.route";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  transaction: transactionRouter,
  user: userRouter,
  notification: notificationsRouter,
  message: messageRouter,
  session: sessionRouter,
  test: testRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
