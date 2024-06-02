import React from "react";
import { api } from "@/trpc/server";
import User from "@/components/user/user";

const Page = async () => {
  const users = await api.user.getAllUsers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold capitalize">Users</h1>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {users.map((user) => (
          <User key={user.id} id={user.id} />
        ))}
      </div>
    </div>
  );
};

export default Page;
