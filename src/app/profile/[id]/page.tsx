import { api } from "@/trpc/server";
import React from "react";
import UserInteractions from "@/components/user/user";
import Page from "../page";

interface PageProps {
  params: {
    id: string;
  };
}
// const Page = async ({ params: { id } }: PageProps) => {
//   const userFriends = await api.user.getFriends({ id });
//   console.log(userFriends);
//   return <User id={id} />;
// };

export default Page;
