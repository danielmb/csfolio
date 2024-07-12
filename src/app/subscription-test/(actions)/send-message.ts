import { Redis } from "@upstash/redis";

export const SendMessage = async (formData: FormData) => {
  "use server";
  const redis = Redis.fromEnv();
  const message = formData.get("message") as string;

  await redis.publish("test", message);
  // return {
  //   message: "Message sent!",
  //   data: {
  //     message,
  //   },
  // };
};
