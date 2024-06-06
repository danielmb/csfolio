import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
const GET = async (req: NextRequest) => {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }
  const users = await db.user.findMany({
    select: {
      id: true,
      Notifications: {
        select: {
          read: false,
        },
      },
    },
  });

  for (const user of users) {
    if (user.Notifications.length > 0) {
      await db.notification.create({
        data: {
          message: "You have unread notifications",
          userId: user.id,
        },
      });
    }
  }

  return NextResponse.json({
    success: true,
  });
};
