"use server";
import { getServerAuthSession } from "@/server/auth";
export const getAuthenticatedUser = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    return null;
  }
  return session.user;
};
