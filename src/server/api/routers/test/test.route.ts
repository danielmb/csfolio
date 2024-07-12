import { observable } from "@trpc/server/observable";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
export interface TestSubscriptionData {
  message: string;
  random: number;
  createdAt: Date;
}
export const testRouter = createTRPCRouter({
  test: protectedProcedure.subscription(async ({ ctx }) => {
    return observable<TestSubscriptionData>((observer) => {
      const interval = setInterval(() => {
        observer.next({
          message: "Hello, world!",
          random: Math.random(),
          createdAt: new Date(),
        });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    });
  }),
});
