import React, { FC } from "react";
import steamApi from "@/lib/steam";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { steamEmailDomain } from "@/providers/SteamProvider";
const ImportStuffPage: FC = async () => {
  const session = await getServerAuthSession();
  const steamId = session?.user.steamId;
  if (!steamId) {
    return <div>Not logged in</div>;
  }
  const userData = await steamApi.getUserFriends(steamId);
  // .then((data) => (Array.isArray(data) ? data[0] : data));
  for (const user of userData) {
    const userExists = await db.user.findFirst({
      where: {
        steamId: user.steamID,
      },
    });

    if (userExists) {
      console.log("User already exists", user.steamID);
      continue;
    }

    const info = await steamApi
      .getUserSummary(user.steamID)
      .then((data) => (Array.isArray(data) ? data[0] : data));

    await db.user.create({
      data: {
        steamId: user.steamID,
        email: `${user.steamID}@${steamEmailDomain}`,
        name: info?.nickname ?? "",

        image:
          info?.avatar.large ?? info?.avatar.medium ?? info?.avatar.small ?? "",
      },
    });
  }
  return <pre>{JSON.stringify(userData, null, 2)}</pre>;
};

export default ImportStuffPage;
