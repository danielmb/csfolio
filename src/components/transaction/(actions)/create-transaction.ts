"use server";

import { api } from "@/trpc/server";

export const createTransaction = async (formdata: FormData) => {
  const res = await api.transaction.create({
    price: Number(formdata.get("price")),
    type: formdata.get("type") as "BUY" | "SELL",
    name: formdata.get("name") as string,
    description: formdata.get("description") as string,
  });
  return null;
};
