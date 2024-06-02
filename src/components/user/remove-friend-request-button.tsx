"use client";

import React from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { type RouterOutputs } from "@/trpc/react";
import { useUser } from "./user-provider";
import { cn } from "@/lib/utils";

const RemoveFriendRequestButton = () => {
  const { friendRequest, update: updateUser } = useUser();
  const { mutate: removeFriendRequest, status: removeFriendRequestStatus } =
    api.user.removeFriendRequest.useMutation({
      onSuccess: () => {
        updateUser();
      },
    });

  const { mutate: rejectFriendRequest, status: rejectFriendRequestStatus } =
    api.user.rejectFriendRequest.useMutation({
      onSuccess: () => {
        updateUser();
      },
    });
  const { mutate: acceptFriendRequest, status: acceptFriendRequestStatus } =
    api.user.acceptFriendRequest.useMutation({
      onSuccess: () => {
        updateUser();
      },
    });

  if (!friendRequest) return null;
  if (friendRequest.isToMe) {
    return (
      <>
        <Button
          disabled={rejectFriendRequestStatus === "pending"}
          onClick={() => {
            // removeFriendRequest({ id: friendRequest.id });
            rejectFriendRequest({ id: friendRequest.id });
          }}
          className=""
          mutationStatus={rejectFriendRequestStatus}
          variant={"destructive"}
        >
          Reject friend request
        </Button>
        <Button
          disabled={acceptFriendRequestStatus === "pending"}
          onClick={() => {
            acceptFriendRequest({ id: friendRequest.id });
          }}
          mutationStatus={acceptFriendRequestStatus}
          className=""
        >
          Accept friend request
        </Button>
      </>
    );
  }
  return (
    <Button
      disabled={removeFriendRequestStatus === "pending"}
      onClick={() => {
        if (!friendRequest?.id) return;
        if (!friendRequest.isToMe) {
          removeFriendRequest({ id: friendRequest.id });
        }
      }}
      variant={"destructive"}
      mutationStatus={removeFriendRequestStatus}
    >
      Cancel friend request
    </Button>
  );
};

export default RemoveFriendRequestButton;
