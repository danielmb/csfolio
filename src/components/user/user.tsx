"use client";

import React from "react";
import { type RouterOutputs, api } from "@/trpc/react";
import RemoveFriendButton from "./profile/remove-friend-button";
import { UserProvider } from "./user-provider";
import FriendRequestControl from "./friend-request-control";
import AddFriendButton from "./profile/add-friend-button";
import { Skeleton } from "../ui/skeleton";
interface UserProps {
  id: string;
  initialUser?: RouterOutputs["user"]["getUser"];
  initialFriendRequest?: RouterOutputs["user"]["getFriendRequest"];
}

const UserInteractions = ({ id }: UserProps) => {
  const { data: user, isFetching: isUserFetching } = api.user.getUser.useQuery(
    {
      id,
    },
    {},
  );
  const { data: friendRequest, isFetching: isFriendRequestFetching } =
    api.user.getFriendRequest.useQuery(
      {
        userIdTo: id,
      },
      {},
    );
  const utils = api.useUtils();
  const update = () => {
    utils.user.getUser.invalidate({ id }).catch(console.error);
    utils.user.getFriendRequest
      .invalidate({ userIdTo: id })
      .catch(console.error);
  };
  const isFetching = isUserFetching || isFriendRequestFetching;
  return (
    <UserProvider
      id={id}
      user={user}
      friendRequest={friendRequest}
      update={update}
    >
      <>
        {isFetching ? (
          <Skeleton className="h-10 w-28 bg-gray-200 dark:bg-gray-700" />
        ) : (
          <>
            {friendRequest?.id && (
              <FriendRequestControl
                id={friendRequest.id}
                onRemoveFriendRequest={update}
                onRejectFriendRequest={update}
                onAcceptFriendRequest={update}
                onError={update}
              />
            )}
            {!friendRequest && !user?.isFriend && <AddFriendButton />}
            {user?.isFriend && <RemoveFriendButton />}
          </>
        )}
      </>
    </UserProvider>
  );
};

export default UserInteractions;
