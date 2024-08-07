"use client";

import React from "react";
import { type RouterOutputs, api } from "@/trpc/react";
import RemoveFriendButton from "./profile/remove-friend-button";
import { UserProvider } from "./user-provider";
import FriendRequestControl from "./friend-request-control";
import AddFriendButton from "./profile/add-friend-button";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { DmButton } from "./profile/dm-button";
import {
  Command,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
interface UserProps {
  id: string;
  initialUser?: RouterOutputs["user"]["getUser"];
  initialFriendRequest?: RouterOutputs["user"]["getFriendRequest"];
}

const UserInteractions = ({ id }: UserProps) => {
  // const session = useSession();
  const { data: user, isFetching: isUserFetching } = api.user.getUser.useQuery(
    {
      id,
    },
    // {
    //   enabled: session.data?.user.id === id,
    // },
  );
  const { data: friendRequest, isFetching: isFriendRequestFetching } =
    api.user.getFriendRequest.useQuery(
      {
        userIdTo: id,
      },
      // {
      //   enabled: session.data?.user.id === id,
      // },
    );
  const utils = api.useUtils();
  const update = () => {
    utils.user.getUser.invalidate({ id }).catch(console.error);
    utils.user.getFriendRequest
      .invalidate({ userIdTo: id })
      .catch(console.error);
  };
  const isFetching = isUserFetching || isFriendRequestFetching;

  // if (session.data?.user.id === id) {
  //   return null;
  // }
  return (
    <UserProvider
      id={id}
      user={user}
      friendRequest={friendRequest}
      update={update}
    >
      <>
        {/* {isFetching ? (
          <Skeleton className="h-10 w-28  bg-gray-200 dark:bg-gray-700" />
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
            <DmButton />
          </>
        )} */}
        <Command>
          <CommandList>
            {isFetching ? (
              <Skeleton className="h-7 w-full  bg-gray-200 dark:bg-gray-700" />
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
            <DmButton />
          </CommandList>
        </Command>
      </>
    </UserProvider>
  );
};

export default UserInteractions;
