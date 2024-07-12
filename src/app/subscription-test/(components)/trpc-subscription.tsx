"use client";
import { api } from "@/trpc/react";
import React from "react";
import type { TestSubscriptionData } from "@/server/api/routers/test/test.route";
export const SubscriptionTest = () => {
  const [latestUpdate, setLatestUpdate] = React.useState<Date | null>(null);
  const [lastUpdates, setLastUpdates] = React.useState<TestSubscriptionData[]>(
    [],
  );
  api.test.test.useSubscription(undefined, {
    onData(data) {
      setLatestUpdate(new Date());
      // setLastUpdates((prev) => [...prev, data]);
      // limit to 10 updates
      setLastUpdates((prev) => [...prev.slice(-9), data]);
    },
  });
  return (
    <div>
      <h1>Subscription Test</h1>
      <p>
        This page demonstrates a subscription to the <code>test</code> endpoint.
      </p>
      <p>
        The server will send a message every second, and the client will display
        the message and the time it was received.
      </p>
      <p>
        <strong>Latest update:</strong>{" "}
        {latestUpdate ? latestUpdate.toLocaleTimeString() : "No updates yet"}
      </p>
      <h2>Last 10 updates:</h2>
      <ul>
        {lastUpdates.map((update, i) => (
          <li key={i} className="mb-2 rounded border p-2">
            <strong>{update.message}</strong> ({update.random})
            <br />
            Received at {update.createdAt.toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
};
