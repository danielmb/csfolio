"use client";

import React from "react";
import { Button } from "../../ui/button";
import { api } from "@/trpc/react";
import { useUser } from "../user-provider";

const RemoveFriendButton = () => {
  const { id: friendId, update: updateUser } = useUser();
  const { mutate: removeFriend, status } = api.user.removeFriend.useMutation({
    onSuccess: () => {
      updateUser();
    },
  });
  return (
    <Button
      mutationStatus={status}
      onClick={() => {
        removeFriend({ id: friendId });
      }}
    >
      Remove friend
    </Button>
  );
};

export default RemoveFriendButton;
