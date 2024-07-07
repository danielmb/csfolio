"use client";

import { api } from "@/trpc/react";
import React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandDialog,
  CommandSeparator,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Chat } from "@/components/chat/chat";
interface ChatProps {
  params: {
    id: string;
  };
}
const Page = ({ params: { id } }: ChatProps) => {
  // const { data: conversations } = api.message..useQuery();
  return (
    <div>
      <Chat conversationId={id} />
    </div>
  );
};

export default Page;
