/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { authOptionsWithRequest } from "@/server/auth";
import NextAuth from "next-auth";
import { NextRequest } from "next/server";

interface Params {
  nextauth: string[];
}
interface AuthProps {
  params: Params;
}
const auth = async (req: NextRequest, props: AuthProps) => {
  return await NextAuth(req, props, authOptionsWithRequest(req));
};

export { auth as GET, auth as POST };
