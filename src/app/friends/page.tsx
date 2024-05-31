import React, { FC } from "react";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import steamApi from "@/lib/steam";
import Image from "next/image";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
const FriendsPage: FC = async () => {
  const session = await getServerAuthSession();
  const steamId = session?.user.steamId;
  if (!steamId) {
    return <div>Not logged in</div>;
  }
  const info = await steamApi.getUserFriends(steamId).then(async (data) => {
    const users = await Promise.all(
      data.map(async (user) => {
        const dbUser = await db.user.findFirst({
          where: {
            steamId: user.steamID,
          },
        });
        if (dbUser) {
          return {
            ...dbUser,
          };
        }
        return null;
      }),
    );
    return users;
  });
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold capitalize">
        <FormattedMessage id="yourFriends" defaultMessage="Your Friends" />
      </h1>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {info.map((user, i) => (
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
