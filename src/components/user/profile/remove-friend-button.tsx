"use client";

import React from "react";
import { Button } from "../../ui/button";
import { api } from "@/trpc/react";
import { useUser } from "../user-provider";
import { useToast } from "@/components/ui/use-toast";
import { CommandItem } from "@/components/ui/command";

const RemoveFriendButton = () => {
  const { toast } = useToast();

  const { id: friendId, update: updateUser } = useUser();
  const { mutate: removeFriend, status } = api.user.removeFriend.useMutation({
    onSuccess: () => {
      updateUser();
      toast({
        title: "Friend removed",
        description: "You have removed this friend",
      });
    },
    onError: () => {
      toast({
        title: "Failed to remove friend",
        description: "Please try again later",
        variant: "destructive",
      });
      updateUser();
    },
  });
  return (
    // <Button
    //   mutationStatus={status}
    //   onClick={() => {
    //     removeFriend({ id: friendId });
    //   }}
    // >
    //   Remove friend
    // </Button>
    <CommandItem
      onSelect={() => {
        removeFriend({ id: friendId });
      }}
    >
      Remove friend
    </CommandItem>
  );
};

export default RemoveFriendButton;
