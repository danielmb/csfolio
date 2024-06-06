"use client";

import React, { type FC, useMemo, useState, useEffect } from "react";
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
import FriendRequestControl from "../user/friend-request-control";
import { useToast } from "../ui/use-toast";
import Link from "next/link";
import {
  FormattedDate,
  FormattedDateTimeRange,
  FormattedRelativeTime,
} from "react-intl";
import FriendRequestControlWithUser from "../user/friend-request-control-with-user";

interface NotificationProps {
  notification: RouterOutputs["notification"]["getNotifications"][number];
  focus?: boolean;
}
export const NotificationCommandItem: FC<NotificationProps> = ({
  notification,
  focus = false,
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
        // if focus
        "animate-pulse": focus,
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
      <div className="flex flex-col space-y-2">
        {notification.type !== "FRIEND_REQUEST" && <>{notification.message}</>}
        {notification.friendRequest.map((friendRequest) => (
          <div key={friendRequest.id} className="flex flex-col justify-between">
            <span>{notification.message}</span>
            <div key={friendRequest.id} className="flex justify-between">
              <FriendRequestControlWithUser
                id={friendRequest.id}
                key={friendRequest.id}
                stopPropagation
              />
            </div>
          </div>
        ))}
        <span className="hidden">{notification.id}</span>
        <span>{!notification.read && "Unread"}</span>
      </div>
      <div className="flex flex-col space-x-2">
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
        {/* <time dateTime={notification.createdAt}>
          <FormattedDate value={notification.createdAt} />http://localhost:3000/profile/clwxp3kmr0000tfzzdkpwmy71
        </time> */}
        <time
          dateTime={notification.createdAt.toString()}
          className="text-center text-xs"
        >
          <FormattedRelativeTime
            numeric="auto"
            updateIntervalInSeconds={5}
            value={
              // new Date(notification.createdAt).getTime() - new Date().getTime()
              (new Date(notification.createdAt).getTime() -
                new Date().getTime()) /
              1000
            }
          />
        </time>
      </div>
    </CommandItem>
  );
};

export const Notifications = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [focusNotification, setFocusNotification] = useState<string | null>(
    null,
  );
  const { toast } = useToast();
  const [previousNotifications, setPreviousNotifications] =
    useState<RouterOutputs["notification"]["getNotifications"]>();
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
  useEffect(() => {
    // remove focus after 5 seconds
    if (focusNotification) {
      const timeout = setTimeout(() => {
        setFocusNotification(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [focusNotification]);
  useEffect(() => {
    // if (previousNotifications.length < unreadNotifications.length) {
    //   const newNotification = unreadNotifications[0];
    //   toast({
    //     title: newNotification?.message,
    //     description: "New notification",
    //   });
    //   setPreviousNotifications(unreadNotifications);
    // }
    if (!notifications) return;

    if (!previousNotifications) {
      setPreviousNotifications(notifications);
      return;
    }

    const newNotifications = notifications.filter(
      (n) => !previousNotifications.find((pn) => pn.id === n.id),
    );
    for (const notification of newNotifications) {
      toast({
        title: notification.message,
        description: "New notification",
        action: (
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => (
                setNotificationsOpen(true),
                setFocusNotification(notification.id)
              )}
            >
              Open notifications
            </Button>
            {notification?.link && (
              <Link href={notification.link}>
                <Button>View</Button>
              </Link>
            )}
          </div>
        ),
      });
    }

    // if different length setPreviousNotifications to avoid a infinite loop
    if (notifications.length !== previousNotifications.length) {
      setPreviousNotifications(notifications);
      return;
    }
    setPreviousNotifications(notifications);
  }, [notifications, previousNotifications, toast]);

  return (
    // <Popover onOpenChange={(open) => open && updateNotifications()}>
    <Popover
      onOpenChange={(open) => {
        open && updateNotifications().catch(console.error);
        setNotificationsOpen(open);
      }}
      open={notificationsOpen}
    >
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
                focus={focusNotification === notification.id}
              />
            ))}
            {(notifications?.length ?? 0) > 0 && <CommandSeparator />}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
