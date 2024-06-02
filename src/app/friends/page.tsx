import React, { FC } from "react";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import steamApi from "@/lib/steam";
import Image from "next/image";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { api } from "@/trpc/server";
const FriendsPage: FC = async () => {
  const friends = await api.user.getFriends();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold capitalize">
        <FormattedMessage id="yourFriends" defaultMessage="Your Friends" />
      </h1>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {friends.length === 0 && (
          <p>
            <FormattedMessage
              id="youHaveNoFriends"
              defaultMessage="You have no friends."
            />
          </p>
        )}
        {friends.map((user, i) => (
          <Link
            href={`https://steamcommunity.com/profiles/${user?.steamId}`}
            key={user?.id ?? i}
          >
            <div className="flex items-center space-x-4 border p-2">
              {user?.image && (
                <Image
                  src={user.image}
                  alt={user.name ?? "User image"}
                  width={50}
                  height={50}
                />
              )}
              <p>{user?.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FriendsPage;
