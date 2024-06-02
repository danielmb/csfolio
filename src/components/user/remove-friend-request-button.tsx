"use client";

import React, { FC } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import LoggedInUserAvatar, { UserAvatar } from "../user-avatar";
import { useToast } from "../ui/use-toast";
interface NotificationData {
  id: string;
}
interface UserProviderProps extends NotificationData {
  onRemoveFriendRequest?: () => void;
  onAcceptFriendRequest?: () => void;
  onRejectFriendRequest?: () => void;
  stopPropagation?: boolean;
  showUser?: boolean;
  onError?: () => void;
}

const FriendRequestControl: FC<UserProviderProps> = ({
  id,
  onRemoveFriendRequest,
  onAcceptFriendRequest,
  onRejectFriendRequest,
  stopPropagation,
  showUser,
  onError,
}) => {
  const { toast } = useToast();

  const { data: friendRequest } = api.user.getFriendRequestById.useQuery({
    id,
  });
  const { data: user } = api.user.getUser.useQuery(
    { id: friendRequest?.userIdFrom ?? "" },
    { enabled: showUser && !!friendRequest?.userIdFrom },
  );
  const { mutate: removeFriendRequest, status: removeFriendRequestStatus } =
    api.user.removeFriendRequest.useMutation({
      onSuccess: () => {
        // updateUser();
        onRemoveFriendRequest?.();
        toast({
          title: "Friend request removed",
          description: "You have removed this friend request",
        });
      },
      onError: () => {
        onError?.();
        toast({
          title: "Failed to remove friend request",
          description: "Please try again later",
          variant: "destructive",
        });
      },
    });

  const { mutate: rejectFriendRequest, status: rejectFriendRequestStatus } =
    api.user.rejectFriendRequest.useMutation({
      onSuccess: () => {
        // updateUser();
        onRejectFriendRequest?.();
        toast({
          title: "Friend request rejected",
          description: "You have rejected this friend request",
        });
      },
      onError: (e) => {
        onError?.();
        toast({
          title: "Failed to reject friend request",
          description: "Please try again later",
          variant: "destructive",
        });
      },
    });
  const { mutate: acceptFriendRequest, status: acceptFriendRequestStatus } =
    api.user.acceptFriendRequest.useMutation({
      onSuccess: () => {
        // updateUser();
        onAcceptFriendRequest?.();

        toast({
          title: "Friend request accepted",
          description: "You have accepted this friend request",
        });
      },
      onError: () => {
        onError?.();
        toast({
          title: "Failed to accept friend request",
          description: "Please try again later",
          variant: "destructive",
        });
      },
    });

  if (!friendRequest) return null;
  if (friendRequest.isToMe) {
    return (
      <div className="flex flex-col items-center space-x-2">
        {showUser && user && (
          <div className="flex flex-col items-center justify-between space-x-2 p-2">
            <UserAvatar userId={user.id} />
            <p>{user.name}</p>
          </div>
        )}
        <div className="flex space-x-2">
          <Button
            disabled={rejectFriendRequestStatus === "pending"}
            onClick={(e) => {
              stopPropagation && e.stopPropagation();
              // removeFriendRequest({ id: friendRequest.id });
              rejectFriendRequest({ id: friendRequest.id });
            }}
            className=""
            mutationStatus={rejectFriendRequestStatus}
            variant={"destructive"}
          >
            Reject
          </Button>
          <Button
            disabled={acceptFriendRequestStatus === "pending"}
            onClick={(e) => {
              stopPropagation && e.stopPropagation();
              acceptFriendRequest({ id: friendRequest.id });
            }}
            mutationStatus={acceptFriendRequestStatus}
            className=""
          >
            Accept
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Button
      disabled={removeFriendRequestStatus === "pending"}
      onClick={(e) => {
        stopPropagation && e.stopPropagation();
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

export default FriendRequestControl;
