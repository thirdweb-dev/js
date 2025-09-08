"use client";

import {
  format,
  formatDistanceToNow,
  isBefore,
  parseISO,
  subDays,
} from "date-fns";
import { ArchiveIcon, ArrowUpRightIcon, BellIcon } from "lucide-react";
import { useMemo } from "react";
import type { Notification } from "@/api/notifications";
import { Button } from "@/components/ui/button";

interface NotificationEntryProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationEntry({
  notification,
  onMarkAsRead,
}: NotificationEntryProps) {
  const timeAgo = useMemo(() => {
    try {
      const now = new Date();
      const date = parseISO(notification.createdAt);
      // if the date is older than 1 day, show the date
      // otherwise, show the time ago

      if (isBefore(date, subDays(now, 1))) {
        return format(date, "MMM d, yyyy");
      }

      return formatDistanceToNow(date, {
        addSuffix: true,
      });
    } catch (error) {
      console.error("Failed to parse date", error);
      return null;
    }
  }, [notification.createdAt]);

  return (
    <div className="flex items-start gap-3 p-4 border-b group hover:bg-card last:border-b-0">
      <div className="p-2.5 rounded-full border bg-card">
        <BellIcon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex w-full flex-row justify-between gap-2 transition-colors">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-1.5">
            <p className="text-sm">{notification.description}</p>
            {timeAgo && (
              <p className="text-muted-foreground text-xs">{timeAgo}</p>
            )}
            <div className="flex flex-row justify-between gap-2 pt-2">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-full bg-card gap-2"
              >
                <a
                  href={notification.ctaUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {notification.ctaText}
                  <ArrowUpRightIcon className="size-4 text-muted-foreground" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        {onMarkAsRead && (
          <div className="flex items-center">
            <Button
              className="p-2 h-auto opacity-0 group-hover:opacity-100 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => onMarkAsRead(notification.id)}
              size="sm"
              variant="ghost"
              aria-label="Archive notification"
            >
              <ArchiveIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
