"use client";

import React from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useUser } from "../user-provider";
import { useToast } from "@/components/ui/use-toast";

const AddFriendButton = () => {
  const { toast } = useToast();
  const { id: userId, update: updateUser } = useUser();
  const { mutate: addFriend, status } = api.user.sendFriendRequest.useMutation({
    onSuccess: () => {
      updateUser();
      toast({
        title: "Friend request sent",
        description: "Your friend request has been sent",
      });
    },
    onError: () => {
      console.log("Failed to add friend");
      toast({
        title: "Failed to add friend",
        description: "Please try again later",
        variant: "destructive",
      });
      updateUser();
    },
  });
  return (
    <Button
      disabled={status === "pending"}
      mutationStatus={status}
      onClick={() => {
        addFriend({ id: userId });
      }}
    >
      Add friend
    </Button>
  );
};

export default AddFriendButton;
