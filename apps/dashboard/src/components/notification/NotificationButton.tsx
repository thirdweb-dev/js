"use client";

import {
  BellIcon,
  GithubIcon,
  NewspaperIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { UseQueryResult } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { ScrollShadow } from "../../@/components/ui/ScrollShadow/ScrollShadow";
import { Spinner } from "../../@/components/ui/Spinner/Spinner";
import { cn } from "../../@/lib/utils";
import { type NotificationInfo, useNotifications } from "./useNotifications";

export function NotificationButton() {
  const notificationsQuery = useNotifications();
  const unreadNotifications = notificationsQuery.data?.filter(
    (x) => !x.isRead,
  ).length;

  return (
    <Popover>
      <PopoverTrigger className="p-2 hover:bg-accent rounded-lg relative">
        <BellIcon className="size-5" />
        {unreadNotifications && unreadNotifications > 0 && (
          <div className="bg-red-500 dark:bg-red-700  px-1 py-0.5 rounded-full absolute top-[-5px] right-[-5px] text-[10px] font-semibold text-white min-w-[20px] flex items-center justify-center">
            {unreadNotifications}
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-[500px] bg-background !z-[1000000] border border-border p-0"
        align="end"
        side="bottom"
        sideOffset={16}
      >
        <NotificationContent notificationsQuery={notificationsQuery} />
      </PopoverContent>
    </Popover>
  );
}

function NotificationContent(props: {
  notificationsQuery: UseQueryResult<NotificationInfo[]>;
}) {
  return (
    <div>
      <div className="p-4">
        <h2 className="text-lg font-semibold"> Notifications </h2>
      </div>
      <div className="border-b border-border" />

      <ScrollShadow scrollableClassName="h-[600px] max-h-[80vh] overflow-scroll">
        {props.notificationsQuery?.data?.map((notification, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <NotificationLink notification={notification} key={index} />
        ))}

        {props.notificationsQuery.isLoading && (
          <div className="absolute flex items-center justify-center inset-0">
            <Spinner className="size-20" />
          </div>
        )}

        <div className="h-10" />
      </ScrollShadow>
    </div>
  );
}

function NotificationLink(props: {
  notification: NotificationInfo;
}) {
  const { notification } = props;

  function getDescription() {
    const description = notification.description;
    if (!description) {
      return;
    }
    const words = description.split(" ");

    if (words.length > 40) {
      return `${words.slice(0, 40).join(" ")}...`;
    }

    return notification.description;
  }

  const description = getDescription();

  const link = new URL(notification.href);
  link.searchParams.append("utm_source", "notification");

  return (
    <Link
      href={link.href}
      target="_blank"
      className={cn(
        "flex gap-4 px-4 py-4 items-start hover:bg-accent relative",
        !notification.isRead && "bg-secondary",
      )}
    >
      {/* Image */}
      {notification.image ? (
        <img
          src={notification.image}
          className="w-[100px] rounded-lg object-cover flex-shrink-0 border border-border border-solid"
          alt=""
        />
      ) : (
        <div className="w-[100px] aspect-video rounded-lg border border-border border-solid flex items-center justify-center p-4 flex-shrink-0">
          {notification.type === "version-release" && (
            <GithubIcon className="size-7 text-foreground" />
          )}

          {notification.type === "youtube" && (
            <YoutubeIcon className="size-7 text-red-500" />
          )}

          {notification.type === "tweet" && (
            <TwitterIcon className="size-7 text-sky-400" />
          )}

          {notification.type === "article" && (
            <NewspaperIcon className="size-7 text-pink-500" />
          )}
        </div>
      )}

      {/* Content */}
      <div>
        <h3 className="text-foreground font-semibold">{notification.title}</h3>
        {description && (
          <p className="text-sm text-secondary-foreground whitespace-pre-wrap font-medium mt-1">
            {description}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2 opacity-90">
          {formatDistance(new Date(notification.timestamp), new Date())} ago
        </p>
      </div>

      {/* unread dot */}
      {!notification.isRead && (
        <span className="flex size-2 absolute top-4 right-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full size-2 bg-red-500" />
        </span>
      )}
    </Link>
  );
}
