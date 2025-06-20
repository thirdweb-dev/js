"use client";
import { ArchiveIcon, BellIcon, Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TabButtons } from "@/components/ui/tabs";
import { Badge } from "../../ui/badge";
import { NotificationEntry } from "./notification-entry";
import type { useNotifications } from "./state/manager";

export function NotificationList(props: ReturnType<typeof useNotifications>) {
  // default to inbox if there are unread notifications, otherwise default to archive
  const [activeTab, setActiveTab] = useState(
    props.unreadNotificationsCount > 0
      ? "inbox"
      : // if we have archived notifications, default to archive
        props.archivedNotifications.length > 0
        ? "archive"
        : // otherwise defualt to inbox (if there are no archived notifications either)
          "inbox",
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex w-full flex-1 flex-col">
      <TabButtons
        tabClassName="!text-sm hover:!bg-transparent !px-0 !py-1"
        tabContainerClassName="space-x-6 px-4 pt-2"
        tabs={[
          {
            isActive: activeTab === "inbox",
            name: (
              <div className="flex items-center gap-1">
                Inbox
                {props.unreadNotificationsCount > 0 && (
                  <Badge variant="secondary">
                    {props.unreadNotificationsCount}
                  </Badge>
                )}
              </div>
            ),
            onClick: () => setActiveTab("inbox"),
          },
          {
            isActive: activeTab === "archive",
            name: "Archive",
            onClick: () => setActiveTab("archive"),
          },
        ]}
      />

      <div
        className="h-full w-full flex-1 overflow-y-auto"
        ref={scrollContainerRef}
      >
        {activeTab === "inbox" ? (
          <InboxTab
            hasMoreUnread={props.hasMoreUnread}
            isFetchingMoreUnread={props.isFetchingMoreUnread}
            isLoadingUnread={props.isLoadingUnread}
            loadMoreUnread={props.loadMoreUnread}
            markAllAsRead={props.markAllAsRead}
            markAsRead={props.markAsRead}
            scrollContainerRef={scrollContainerRef}
            unreadNotifications={props.unreadNotifications}
          />
        ) : (
          <ArchiveTab
            archivedNotifications={props.archivedNotifications}
            hasMoreArchived={props.hasMoreArchived}
            isFetchingMoreArchived={props.isFetchingMoreArchived}
            isLoadingArchived={props.isLoadingArchived}
            loadMoreArchived={props.loadMoreArchived}
            scrollContainerRef={scrollContainerRef}
          />
        )}
      </div>
    </div>
  );
}

function InboxTab(
  props: Pick<
    ReturnType<typeof useNotifications>,
    | "unreadNotifications"
    | "isLoadingUnread"
    | "hasMoreUnread"
    | "isFetchingMoreUnread"
    | "loadMoreUnread"
    | "markAsRead"
    | "markAllAsRead"
  > & {
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  },
) {
  return props.unreadNotifications.length === 0 ? (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <BellIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-sm">No new notifications</p>
    </div>
  ) : (
    <>
      {props.unreadNotifications.map((notification) => (
        <NotificationEntry
          key={notification.id}
          notification={notification}
          onMarkAsRead={props.markAsRead}
        />
      ))}
      <AutoLoadMore
        hasMore={props.hasMoreUnread}
        isLoading={props.isFetchingMoreUnread || props.isLoadingUnread}
        loadMore={props.loadMoreUnread}
        scrollContainerRef={props.scrollContainerRef}
      />
    </>
  );
}

function ArchiveTab(
  props: Pick<
    ReturnType<typeof useNotifications>,
    | "archivedNotifications"
    | "isLoadingArchived"
    | "hasMoreArchived"
    | "isFetchingMoreArchived"
    | "loadMoreArchived"
  > & {
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  },
) {
  return props.archivedNotifications.length === 0 ? (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <ArchiveIcon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-sm">No archived notifications</p>
    </div>
  ) : (
    <>
      {props.archivedNotifications.map((notification) => (
        <NotificationEntry key={notification.id} notification={notification} />
      ))}
      <AutoLoadMore
        hasMore={props.hasMoreArchived}
        isLoading={props.isFetchingMoreArchived || props.isLoadingArchived}
        loadMore={props.loadMoreArchived}
        scrollContainerRef={props.scrollContainerRef}
      />
    </>
  );
}

function AutoLoadMore(props: {
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // if the element is scrolled into view, load more
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // only run if the ref and scroll container ref are defined
    if (ref.current && props.scrollContainerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !props.isLoading && props.hasMore) {
              props.loadMore();
              observer.unobserve(entry.target); // prevent duplicate fires
            }
          }
        },
        { root: props.scrollContainerRef.current, threshold: 0.1 },
      );

      observer.observe(ref.current);

      return () => observer.disconnect();
    }
  }, [
    props.hasMore,
    props.isLoading,
    props.loadMore,
    props.scrollContainerRef,
  ]);

  if (!props.hasMore) return null;

  if (props.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2Icon className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return <div aria-hidden className="h-[1px] w-full opacity-0" ref={ref} />;
}
