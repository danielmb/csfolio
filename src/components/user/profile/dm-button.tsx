import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import React from "react";
import { toast } from "react-toastify";
import { useUser } from "../user-provider";
import { useRouter } from "next/navigation";
import { CommandItem } from "@/components/ui/command";
export const DmButton = () => {
  const { id } = useUser();
  const { mutateAsync: dm } =
    api.message.getOrCreatePrivateConversation.useMutation();
  const router = useRouter();
  return (
    <CommandItem
      onSelect={async () => {
        const res = await dm({ userId: id });
        router.push(`/messages/${res.id}`);
        // redirect(`/messages/${res.id}`);
      }}
    >
      Send Private Message
    </CommandItem>
  );
};
