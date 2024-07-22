import { MessageEvent } from "@/app/api/chat/[id]/route";
import { useEffect, useState } from "react";
import SuperJSON, { SuperJSONResult } from "superjson";

interface ChatParams {
  id: string;
  onMessage?: (message: MessageEvent) => void;
}
const connectToStream = (chatParams: ChatParams) => {
  const eventSource = new EventSource(`/api/chat/${chatParams.id}`);
  eventSource.onmessage = (event) => {
    const data = SuperJSON.deserialize<MessageEvent>(
      JSON.parse(event.data as string) as SuperJSONResult,
    );
    data.type === "message" && chatParams.onMessage?.(data);
  };
  eventSource.onopen = () => {
    console.log("Ready to receive chat messages");
  };
  eventSource.onerror = (event) => {
    console.error("Chat error", event);
    eventSource.close();
    setTimeout(() => {
      connectToStream(chatParams);
    });
  };

  eventSource.addEventListener("close", (event) => {
    console.log("Connection closed", event);
    setTimeout(() => {
      connectToStream(chatParams);
    });
  });

  return eventSource;
};

export const useChat = ({ id, onMessage }: ChatParams) => {
  // const eventSource = new EventSource(`/api/chat/${id}`);
  useEffect(() => {
    // update eventSource on id change maybe?
  }, [id]);
  useEffect(() => {
    // console.log("useChat", id);
    // // const eventSource = new EventSource(`/api/chat/${id}`);
    // const eventSource = new EventSource(`/api/chat/${id}`);
    // eventSource.onmessage = (event) => {
    //   console.log("chat message", event.data);
    //   const data = SuperJSON.deserialize<MessageEvent>(
    //     JSON.parse(event.data as string) as SuperJSONResult,
    //   );
    //   data.type === "message" && onMessage?.(data);
    // };
    // eventSource.onopen = () => {
    //   console.log("Ready to receive chat messages");
    // };
    // eventSource.onerror = (event) => {
    //   console.error("Chat error", event);

    const eventSource = connectToStream({ id, onMessage });
    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
};
