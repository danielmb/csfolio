import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
export const GET = async (req: NextRequest) => {
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
  const minuteAgo = new Date(Date.now() - 1000 * 60);

  const users = await db.user.findMany({
    select: {
      id: true,
      Notifications: {
        where: {
          read: false,
          createdAt: {
            lte: minuteAgo,
          },
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
