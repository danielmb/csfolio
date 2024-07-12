import { ChatServerSubscriber } from "@/redis/chat";
import {
  MessageWithInclude,
  messageInclude,
} from "@/server/api/routers/message/message.router";
import { db } from "@/server/db";
import { api } from "@/trpc/server";
import { NextRequest, NextResponse } from "next/server";

import SuperJSON from "superjson";
export const dynamic = "force-dynamic";

interface ChatParams {
  params: {
    id: string;
  };
}

export interface MessageEvent {
  type: "message";
  message: MessageWithInclude;
}
export interface ConnectionEvent {
  type: "connection";
  id: string;
}
export interface PingEvent {
  type: "ping";
}

export type ChatEvents = MessageEvent | PingEvent;
export async function GET(req: NextRequest, { params: { id } }: ChatParams) {
  const hasPermission = await api.message.hasAccessToConversation(id);
  if (!hasPermission) {
    return NextResponse.json({
      status: 403,
      message: "Forbidden",
    });
  }

  const encoder = new TextEncoder();

  const customReadableStream = new ReadableStream({
    async start(controller) {
      const channel = `conversation:${id}`;
      const stream = new ChatServerSubscriber(channel);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      stream.onMessage(async (message) => {
        const dbMessage = await db.message.findFirst({
          include: messageInclude,
          where: {
            id: message.id,
          },
        });
        if (!dbMessage) {
          return;
        }
        const event: MessageEvent = {
          type: "message",
          message: dbMessage,
        };

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify(SuperJSON.serialize(event))}\n\n`,
          ),
        );
      });

      await stream.subscribe().then(() => {
        // controller.enqueue(encoder.encode("data: connected\n\n"));
        const event: ConnectionEvent = {
          type: "connection",
          id,
        };
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify(SuperJSON.serialize(event))}\n\n`,
          ),
        );
      });

      return () => {
        stream.stream.redis.disconnect();
        controller.close();
      };
    },
  });

  return new Response(customReadableStream, {
    // Set the headers for Server-Sent Events (SSE)
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "none",
    },
  });
}
