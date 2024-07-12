export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const customReadableStream = new ReadableStream({
    start(controller) {
      // const encoder = new TextEncoder();
      // controller.enqueue(encoder.encode("Hello, "));
      // controller.enqueue(encoder.encode("world!"));
      // controller.close();
      // send hello world every second
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode("data: Hello, world!\n\n"));
        } catch (error) {
          clearInterval(interval);
          console.error(error);
          controller.error(error);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
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
