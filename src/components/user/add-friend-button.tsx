"use client";

import React from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useUser } from "./user-provider";

const AddFriendButton = () => {
  const { id: userId, update: updateUser } = useUser();
  const { mutate: addFriend, status } = api.user.sendFriendRequest.useMutation({
    onSuccess: () => {
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
