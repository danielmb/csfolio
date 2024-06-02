"use client";

import React, { type FC, useMemo } from "react";
import { useRouter } from "next/navigation";

import { BellIcon, Trash } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { type RouterOutputs, api } from "@/trpc/react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import FriendRequestControl from "../user/remove-friend-request-button";

interface NotificationProps {
  notification: RouterOutputs["notification"]["getNotifications"][number];
}
export const NotificationCommandItem: FC<NotificationProps> = ({
  notification,
}) => {
  const { mutate: markAsRead, status: markAsReadStatus } =
    api.notification.readNotification.useMutation({
      onSuccess: () => {
        api
          .useUtils()
          .notification.getNotifications.invalidate(undefined)
          .catch(console.error);
      },
    });
  const { mutate: removeNotification, status: removeNotificationStatus } =
    api.notification.removeNotification.useMutation({
      onSuccess: () => {
        api
          .useUtils()
          .notification.getNotifications.invalidate(undefined)
          .catch(console.error);
      },
    });
  const router = useRouter();

  return (
    <CommandItem
      // className="flex justify-between"
      className={cn("flex  justify-between", {
        // "bg-gray-200": notification.type === "FRIEND_REJECTED"
      })}
      key={notification.id}
      onSelect={
        () => (
          markAsRead({
            id: notification.id,
          }),
          notification.link && router.push(notification.link)
        )
        // if(notification.link) {
        //   router.push(notification.link);
        // }
      }
    >
      {notification.type !== "FRIEND_REQUEST" && <>{notification.message}</>}
      {notification.friendRequest.map((friendRequest) => (
        <div key={friendRequest.id} className="flex flex-col justify-between">
          <span>{notification.message}</span>
          <div key={friendRequest.id} className="flex justify-between">
            <FriendRequestControl
              showUser
              id={friendRequest.id}
              key={friendRequest.id}
              stopPropagation
            />
          </div>
        </div>
      ))}
      <span className="hidden">{notification.id}</span>
      <Button
        disabled={removeNotificationStatus === "pending"}
        mutationStatus={removeNotificationStatus}
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          removeNotification({ id: notification.id });
        }}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </CommandItem>
  );
};

export const Notifications = () => {
  const { data: notifications } = api.notification.getNotifications.useQuery(
    undefined,
    {
      // refetchInterval: 10000,
      // staleTime: 10000,
      staleTime: 10000,
      refetchInterval: 5000,
    },
  );
  const utils = api.useUtils();
  const updateNotifications = () =>
    utils.notification.getNotifications.invalidate(undefined);
  const unreadNotifications = useMemo(
    () => notifications?.filter((n) => !n.read) ?? [],
    [notifications],
  );
  const readNotifications = useMemo(
    () => notifications?.filter((n) => n.read) ?? [],
    [notifications],
  );
  return (
    <Popover onOpenChange={(open) => open && updateNotifications()}>
      <PopoverTrigger>
        <div className="relative">
          <BellIcon className="h-6 w-6" />
          {/* {notifications?.length ? (
            <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></div>
          ) : null} */}
          {unreadNotifications.length ? (
            <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></div>
          ) : null}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search notifications" />
          <CommandList>
            <CommandEmpty>No notifications</CommandEmpty>
            {notifications?.map((notification) => (
              <NotificationCommandItem
                key={notification.id}
                notification={notification}
              />
            ))}
            {(notifications?.length ?? 0) > 0 && <CommandSeparator />}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
