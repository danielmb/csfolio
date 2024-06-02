/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { authOptionsWithRequest } from "@/server/auth";
import NextAuth from "next-auth";

const auth = async (req: any, res: any) => {
  return await NextAuth(req, res, authOptionsWithRequest(req));
};

export { auth as GET, auth as POST };
