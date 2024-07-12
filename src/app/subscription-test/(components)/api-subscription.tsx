"use client";
import { api } from "@/trpc/react";
import React, { useEffect, useState } from "react";
import type { TestSubscriptionData } from "@/server/api/routers/test/test.route";
import { Button } from "@/components/ui/button";
import { StreamTestEvent } from "../../api/stream-test/route";
import SuperJSON, { SuperJSONResult } from "superjson";
export const SubscriptionApiTest = () => {
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    const eventSource = new EventSource("/api/stream-test");
    // eventSource.addEventListener("message", (event) => {
    //   console.log(event.data);
    // });
    eventSource.onmessage = (event) => {
      // console.log(event.data);
      // const data = JSON.parse(event.data as string) as StreamTestEvent;
      const data = SuperJSON.deserialize<StreamTestEvent>(
        JSON.parse(event.data as string) as SuperJSONResult,
      );
      console.log(data, event.data);
      switch (data.type) {
        case "message":
          setMessages((prev) => [...prev, data.message]);
          break;
        case "join":
          console.log("User joined:", data.id);
          break;
        case "leave":
          console.log("User left:", data.id);
          break;
      }
    };
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Subscription API Test</h1>
      <p>
        This page demonstrates a subscription to the{" "}
        <code>/api/stream-test</code> endpoint.
      </p>
      <p>
        The server will send a message every second, and the client will log the
        message.
      </p>
      <h2>Messages:</h2>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </div>
  );
};
