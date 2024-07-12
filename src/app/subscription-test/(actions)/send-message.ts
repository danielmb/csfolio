import { ChatServerPublisher } from "@/redis/chat";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

// import { Redis } from "@upstash/redis";
export const SendMessage = async (formData: FormData) => {
  "use server";
  // const redis = Redis.fromEnv();
  const session = await getServerAuthSession();
  if (!session) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  const message = formData.get("message") as string;
  const channelId = formData.get("channelId") as string;

  const hasAccess = await api.message.hasAccessToConversation(channelId);
  if (!hasAccess) {
    return {
      status: 403,
      message: "Forbidden",
    };
  }

  // await new ChatServerPublisher("test").sendMessage(message);
};
