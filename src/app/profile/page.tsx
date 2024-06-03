import LoggedInUserAvatar, { UserAvatar } from "@/components/user-avatar";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Image from "next/image";
import React, { FC } from "react";
import Link from "next/link";
import UserInteractions from "@/components/user/user";

interface UserProps {
  params?: {
    id?: string;
  };
}
const Page: FC<UserProps> = async ({ params }) => {
  const session = await getServerAuthSession();
  const userId = params?.id ?? session?.user.id;
  if (!userId) {
    return <div>User not found</div>;
  }
  const user = await api.user.getUser({
    id: userId,
  });
  const friends = await api.user.getFriends({
    id: userId,
  });
  return (
    // center the content in the page not in the y-axis
    <div className="flex justify-center">
      <div className="w-1/2 rounded-lg bg-gray-300 p-6 dark:bg-gray-800">
        <div className="flex flex-row justify-between">
          <div className="flex">
            {/* <LoggedInUserAvatar width={120} height={120} className="border-4" /> */}
            <div className="relative h-32 w-32">
              <div className="relative h-full w-full">
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name ?? "User"}
                    layout="fill"
                    fill
                  />
                )}
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex flex-row space-x-2">
                <p className="text-gray-600">Display name</p>
                <p className="text-gray-600" aria-label="Country">
                  NO Norway
                </p>
              </div>
            </div>
          </div>
          <div>
            {userId !== session?.user.id && <UserInteractions id={userId} />}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div></div>
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-bold">Friends</h2>
            <div className="grid grid-cols-1 gap-4">
              {friends.map((friend) => (
                <Link
                  key={friend.id}
                  href={`/profile/[id]`}
                  as={`/profile/${friend.id}`}
                >
                  <div key={friend.id} className="flex flex-row space-x-2">
                    <div className="relative h-10 w-10">
                      <div className="relative h-full w-10">
                        {friend.image && (
                          <Image
                            src={friend.image}
                            alt={friend.name ?? "Friend"}
                            layout="fill"
                            fill
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex w-fit flex-col flex-wrap space-y-2 text-wrap">
                      <p className="text-wrap text-gray-600">{friend.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
              {friends.length === 0 && (
                <p className="text-gray-600">This user has no friends yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
