"use client";
import React from "react";
import Image, { type ImageProps } from "next/image";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
// import { getAuthenticatedUser } from "./user-avatar-actions";

interface UserAvatarProps extends Partial<ImageProps> {
  className?: string;
  width?: number;
  height?: number;
}
const LoggedInUserAvatar: React.FC<UserAvatarProps> = ({
  className = "rounded-full",
  width = 40,
  height = 40,
}) => {
  const { data, status } = useSession();

  const user = data?.user;
  if (status === "loading") {
    return (
      <div className="relative">
        {/* <Skeleton className="h-10 w-10 rounded-full" /> */}
        <Skeleton className={cn("h-10 w-10", className)} />
      </div>
    );
  }

  return (
    <div className="relative">
      {user?.image ? (
        <Image
          src={user.image}
          alt={user.name ?? "User avatar"}
          width={width}
          height={height}
          // className="rounded-full"
          className={className}
        />
      ) : (
        // <User className="h-10 w-10" />
        <User className={cn("h-10 w-10", className)} />
      )}
    </div>
  );
};

interface UserAvatarByIdProps extends UserAvatarProps {
  userId: string;
}
export const UserAvatar: React.FC<UserAvatarByIdProps> = ({
  userId,
  className,
  width,
  height,
  ...props
}) => {
  const { data: user, status } = api.user.getUser.useQuery({ id: userId });
  if (status === "pending") {
    return (
      <div className="relative">
        <Skeleton className={cn("h-10 w-10", className ?? "rounded-full")} />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {user?.image ? (
        <Image
          src={user.image}
          alt={user.name ?? "User avatar"}
          width={width}
          height={height}
          className={className ?? "rounded-full"}
          {...props}
        />
      ) : (
        <User className="h-10 w-10" />
      )}
    </div>
  );
};

export default LoggedInUserAvatar;
