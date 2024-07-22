import { RedisStream } from "@/lib/stream";
import SuperJSON from "superjson";
export const dynamic = "force-dynamic";
export interface MessageEvent {
  type: "message";
  message: string;
  id: number;
}
export interface JoinEvent {
  type: "join";
  id: number;
}
export interface LeaveEvent {
  type: "leave";
  id: number;
}

export type StreamTestEvent = MessageEvent | JoinEvent | LeaveEvent;

export async function GET() {
  const encoder = new TextEncoder();

  const customReadableStream = new ReadableStream({
    start(controller) {
      // const encoder = new TextEncoder();
      // controller.enqueue(encoder.encode("Hello, "));
      // controller.enqueue(encoder.encode("world!"));
      // controller.close();
      // send hello world every second
      // const interval = setInterval(() => {
      //   try {
      //     // controller.enqueue(encoder.encode("data: Hello, world!\n\n"));
      //     const event: StreamTestEvent = {
      //       type: "message",
      //       message: "Hello, world!",
      //       id: Math.floor(Math.random() * 100),
      //     };
      //     const data = SuperJSON.serialize(event);
      //     controller.enqueue(
      //       // encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
      //       encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
      //     );
      //   } catch (error) {
      //     clearInterval(interval);
      //     console.error(error);
      //     controller.error(error);
      //   }
      // }, 1000);
      const stream = new RedisStream().redis;
      stream
        .subscribe("test", (err, count) => {
          if (err) {
            console.error(err);
            controller.error(err);
          }
        })
        .catch((err) => {
          console.error(err);
          controller.error(err);
        });
      stream.on("message", (channel, message) => {
        const event: StreamTestEvent = {
          type: "message",
          message: message,
          id: Math.floor(Math.random() * 100),
        };
        const data = SuperJSON.serialize(event);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      });
      return () => {
        // clearInterval(interval);
        stream.unsubscribe("test").catch((err) => {
          console.error(err);
          controller.error(err);
        });
        stream.quit().catch((err) => {
          console.error(err);
          controller.error(err);
        });
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
