import React from "react";
import { api } from "@/trpc/server";
import Link from "next/link";
import Image from "next/image";

const Page = async () => {
  const users = await api.user.getAllUsers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold capitalize">Users</h1>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {users.map((user) => (
          <Link href={`/profile/${user.id}`} key={user.id}>
            <div className="flex cursor-pointer flex-col items-center rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name ?? "User"}
                  width={100}
                  height={100}
                />
              )}
              <p className="text-sm font-semibold">{user.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
