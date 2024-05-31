import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

const createTransactionInput = z.object({
  price: z.number(),
  type: z.enum(["BUY", "SELL"]),
  name: z.string(),
  description: z.string(),
});
export const transactionRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    const transactions = await db.transaction.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return transactions;
  }),

  create: protectedProcedure
    .input(createTransactionInput)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const transaction = await db.transaction.create({
        data: {
          name: input.name,
          description: input.description,
          transactionDate: new Date(),
          price: input.price,
          type: input.type,
          userId: session.user.id,
        },
      });
      return transaction;
    }),
});
