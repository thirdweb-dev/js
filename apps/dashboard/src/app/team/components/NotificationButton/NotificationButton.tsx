"use client";

import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TabButtons } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import { ActivityIcon, BellIcon, InboxIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cleanupReadNotifications } from "./fetch-notifications";

export type NotificationMetadata = {
  title: string;
  id: string;
  href: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationTabs = {
  changelogs: {
    notifications: NotificationMetadata[];
    isPending: boolean;
  };
  inbox: {
    notifications: NotificationMetadata[];
    isPending: boolean;
  };
};

export function NotificationButtonUI(props: {
  getChangelogs: () => Promise<NotificationMetadata[]>;
  getInboxNotifications: () => Promise<NotificationMetadata[]>;
  markNotificationAsRead: (id: string) => Promise<void>;
}) {
  const inboxNotificationsQuery = useQuery({
    queryKey: ["inbox-notifications"],
    queryFn: props.getInboxNotifications,
  });

  const changelogsQuery = useQuery({
    queryKey: ["changelogs"],
    queryFn: props.getChangelogs,
  });

  const [readNotifications, setReadNotifications] = useState<Set<string>>(
    new Set(),
  );

  const changelogNotifications = useMemo(() => {
    return (changelogsQuery.data || []).map((notification) => ({
      ...notification,
      isRead: notification.isRead || readNotifications.has(notification.id),
    }));
  }, [changelogsQuery.data, readNotifications]);

  const inboxNotifications = useMemo(() => {
    return (inboxNotificationsQuery.data || []).map((notification) => ({
      ...notification,
      isRead: notification.isRead || readNotifications.has(notification.id),
    }));
  }, [inboxNotificationsQuery.data, readNotifications]);

  // Ensure we don't keep adding things to the IndexedDB storage by removing notification ids that are no longer being displayed
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (changelogNotifications.length > 0 && inboxNotifications.length > 0) {
      cleanupReadNotifications({
        changelogs: changelogNotifications,
        updates: inboxNotifications,
      });
    }
  }, [changelogNotifications, inboxNotifications]);

  const markAsRead = useCallback(
    async (id: string) => {
      setReadNotifications((prev) => new Set([...prev, id]));
      await props.markNotificationAsRead(id);
    },
    [props.markNotificationAsRead],
  );

  const notificationTabs: NotificationTabs = {
    inbox: {
      notifications: inboxNotifications,
      isPending: inboxNotificationsQuery.isPending,
    },
    changelogs: {
      notifications: changelogNotifications,
      isPending: changelogsQuery.isPending,
    },
  };

  return (
    <NotificationButtonInner
      notificationTabs={notificationTabs}
      markNotificationAsRead={markAsRead}
    />
  );
}

export function NotificationButtonInner(props: {
  notificationTabs: NotificationTabs;
  markNotificationAsRead: (id: string) => Promise<void>;
}) {
  const hasUnreadInboxNotifications =
    props.notificationTabs.inbox.notifications.some((x) => !x.isRead);
  const [tab, setTab] = useState<keyof NotificationTabs>("inbox");

  const unreadNotifications = {
    inbox: props.notificationTabs.inbox.notifications.filter((x) => !x.isRead),
    changelogs: props.notificationTabs.changelogs.notifications.filter(
      (x) => !x.isRead,
    ),
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="relative size-10 rounded-full bg-background p-0"
          variant="outline"
        >
          <BellIcon className="size-4 text-muted-foreground" />
          {hasUnreadInboxNotifications && (
            <div className="absolute top-0 right-0 flex size-2.5 items-center justify-center rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="!z-50 ml-4 w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border p-0 shadow-xl lg:ml-0 lg:w-[500px]"
        align="end"
        sideOffset={10}
        side="bottom"
      >
        <TabButtons
          tabClassName="!text-sm"
          tabContainerClassName="px-2 pt-1.5"
          tabs={[
            {
              isActive: tab === "inbox",
              name: (
                <BadgeTab
                  name="Inbox"
                  unreadCount={unreadNotifications.inbox.length}
                />
              ),
              onClick: () => setTab("inbox"),
            },
            {
              isActive: tab === "changelogs",
              name: (
                <BadgeTab
                  name="Changelog"
                  unreadCount={unreadNotifications.changelogs.length}
                />
              ),
              onClick: () => setTab("changelogs"),
            },
          ]}
        />

        {tab === "inbox" && (
          <NotificationContent
            notifications={props.notificationTabs.inbox.notifications}
            isPending={props.notificationTabs.inbox.isPending}
            icon={InboxIcon}
            markNotificationAsRead={props.markNotificationAsRead}
          />
        )}

        {tab === "changelogs" && (
          <NotificationContent
            notifications={props.notificationTabs.changelogs.notifications}
            isPending={props.notificationTabs.changelogs.isPending}
            icon={ActivityIcon}
            markNotificationAsRead={props.markNotificationAsRead}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

function BadgeTab(props: {
  name: string;
  unreadCount: number;
}) {
  return (
    <span className="flex items-center gap-2">
      {props.name}
      {props.unreadCount > 0 && (
        <span className="rounded-lg bg-accent px-1.5 py-1 text-xs">
          {props.unreadCount}
        </span>
      )}
    </span>
  );
}

function NotificationContent(props: {
  notifications: NotificationMetadata[];
  isPending: boolean;
  icon: React.FC<{ className?: string }>;
  markNotificationAsRead: (id: string) => Promise<void>;
}) {
  return (
    <div>
      <ScrollShadow
        scrollableClassName="h-[70vh] overscroll-contain"
        shadowClassName="z-20"
        shadowColor="hsl(var(--background))"
      >
        {props.notifications?.map((notification) => (
          <NotificationLink
            notification={notification}
            key={notification.id}
            icon={props.icon}
            markNotificationAsRead={props.markNotificationAsRead}
          />
        ))}

        {props.isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner className="size-10" />
          </div>
        )}

        {!props.isPending && props.notifications.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div>
              <div className="mb-3 flex justify-center">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground">
                  <props.icon className="size-4" />
                </div>
              </div>
              <p className="text-center text-muted-foreground text-sm">
                No Notifications
              </p>
            </div>
          </div>
        )}
      </ScrollShadow>
    </div>
  );
}

function NotificationLink(props: {
  notification: NotificationMetadata;
  icon: React.FC<{ className?: string }>;
  markNotificationAsRead: (id: string) => Promise<void>;
}) {
  const { notification } = props;

  const link = new URL(notification.href);
  link.searchParams.append("utm_source", "notification");

  const handleClick = useCallback(async () => {
    if (!notification.isRead) {
      await props.markNotificationAsRead(notification.id);
    }
  }, [notification.id, notification.isRead, props.markNotificationAsRead]);

  return (
    <Link
      href={link.href}
      target="_blank"
      className="relative flex items-start gap-4 border-b px-4 py-4 hover:bg-accent/50"
      onClick={handleClick}
    >
      {/* Icon */}
      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full border bg-card text-muted-foreground">
        <props.icon className="size-4" />
      </div>

      {/* Content */}
      <div className="grow">
        <h3 className="font-medium text-foreground text-sm">
          {notification.title}
        </h3>
        <p className="mt-1 text-muted-foreground text-xs">
          {formatDistance(new Date(notification.createdAt), new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>

      <div className="flex w-6 items-center justify-center self-stretch">
        {!notification.isRead && (
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
        )}
      </div>
    </Link>
  );
}
