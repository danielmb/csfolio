import { NextRequest, NextResponse } from "next/server";
import { registerRouteSchema } from "./route.schema";
import { hash } from "bcrypt";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
  const { data, success, error } = registerRouteSchema.safeParse(
    await req.json(),
  );
  if (!success) {
    return NextResponse.json({ error: error?.errors }, { status: 400 });
  }

  const hashedPassword = await hash(data.password, 10);

  // Save user to database
  await db.account.create({
    data: {
      provider: "emailProvider",
      providerAccountId: data.username,
      type: "email",
      password: hashedPassword,
      user: {
        create: {
          username: data.username,
        },
      },
    },
  });

  return NextResponse.json({ message: "success" });
}
