"use client";

import React, { type FC } from "react";

import { api } from "@/trpc/react";
import FriendRequestControl, {
  type FriendRequestControlProps,
} from "./friend-request-control";

const FriendRequestControlWithUser: FC<FriendRequestControlProps> = ({
  ...props
}) => {
  const { data: friendRequest } = api.user.getFriendRequestById.useQuery({
    id: props.id,
  });
  const { data: user } = api.user.getUser.useQuery(
    { id: friendRequest?.userIdFrom ?? "" },
    { enabled: !!friendRequest?.userIdFrom },
  );
  return <FriendRequestControl user={user} {...props} />;
};

export default FriendRequestControlWithUser;
