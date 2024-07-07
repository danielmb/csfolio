"use client";

import { api } from "@/trpc/react";
import React, {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

interface LiveSessionContext {
  session: string;
}

const LiveSessionContext = createContext<LiveSessionContext | undefined>(
  undefined,
);

export const LiveSessionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<string>("");
  api.session.initSession.useSubscription(Math.random(), {
    onData: (data) => {
      setSession(data);
    },
  });
  return (
    <LiveSessionContext.Provider value={{ session }}>
      {children}
    </LiveSessionContext.Provider>
  );
};

export function useLiveSession() {
  const context = useContext(LiveSessionContext);
  if (context === undefined) {
    throw new Error("useLiveSession must be used within a LiveSessionProvider");
  }
  return context;
}
