import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { api } from "@/trpc/react";
// import { getAuthenticatedUser } from "./user-avatar-actions";

const LoggedInUserAvatar: React.FC = () => {
  const { data, status } = useSession();

  const user = data?.user;
  if (status === "loading") {
    return (
      <div className="relative">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative">
      {user?.image ? (
        <Image
          src={user.image}
          alt={user.name ?? "User avatar"}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <User className="h-10 w-10" />
      )}
    </div>
  );
};

interface UserAvatarProps {
  userId: string;
}
export const UserAvatar: React.FC<UserAvatarProps> = ({ userId }) => {
  const { data: user, status } = api.user.getUser.useQuery({ id: userId });
  if (status === "pending") {
    return (
      <div className="relative">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative">
      {user?.image ? (
        <Image
          src={user.image}
          alt={user.name ?? "User avatar"}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <User className="h-10 w-10" />
      )}
    </div>
  );
};

export default LoggedInUserAvatar;
