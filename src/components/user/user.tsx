"use client";

import React from "react";
import { type RouterOutputs, api } from "@/trpc/react";
import AddFriendButton from "@/components/user/add-friend-button";
import RemoveFriendRequestButton from "./remove-friend-request-button";
import RemoveFriendButton from "./remove-friend-button";
import { UserProvider } from "./user-provider";
interface UserProps {
  id: string;
}

const User = ({ id }: UserProps) => {
  const { data: user } = api.user.getUser.useQuery({ id });
  const { data: friendRequest } = api.user.getFriendRequest.useQuery({
    userIdTo: id,
  });
  const utils = api.useUtils();
  const update = () => {
    utils.user.getUser.invalidate({ id }).catch(console.error);
    utils.user.getFriendRequest
      .invalidate({ userIdTo: id })
      .catch(console.error);
  };
  return (
    <UserProvider
      id={id}
      user={user}
      friendRequest={friendRequest}
      update={update}
    >
      <div>
        <p>{user?.name}</p>
        <p>{user?.steamId}</p>
        <p>{user?.id}</p>
        {friendRequest?.id && <RemoveFriendRequestButton />}
        {!friendRequest && !user?.isFriend && <AddFriendButton />}
        {user?.isFriend && <RemoveFriendButton />}
      </div>
    </UserProvider>
  );
};

export default User;
