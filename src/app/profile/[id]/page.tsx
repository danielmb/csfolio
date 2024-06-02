import { api } from "@/trpc/server";
import React from "react";
import AddFriendButton from "../../../components/user/add-friend-button";
import RemoveFriendRequestButton from "../../../components/user/remove-friend-request-button";
import User from "@/components/user/user";

interface PageProps {
  params: {
    id: string;
  };
}
const Page = async ({ params: { id } }: PageProps) => {
  const user = await api.user.getUser({ id });
  const userFriends = await api.user.getFriends({ id });
  const friendRequest = await api.user.getFriendRequest({ userIdTo: id });
  console.log(userFriends);
  return (
    // <div className="container mx-auto p-4">
    //   <h1 className="text-2xl font-bold capitalize">{user.name}</h1>
    //   <p>{user.steamId}</p>
    //   <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
    //     {userFriends.map((friend) => (
    //       <div key={friend.id}>
    //         <p>{friend.name}</p>
    //         <p>{friend.steamId}</p>
    //       </div>
    //     ))}
    //   </div>
    //   {friendRequest && (
    //     <RemoveFriendRequestButton friendRequest={friendRequest} />
    //   )}
    //   {!friendRequest && <AddFriendButton userId={id} />}
    // </div>
    <User id={id} />
  );
};

export default Page;
