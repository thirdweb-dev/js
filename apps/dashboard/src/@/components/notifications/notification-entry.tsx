"use client";

import {
  format,
  formatDistanceToNow,
  isBefore,
  parseISO,
  subDays,
} from "date-fns";
import { ArchiveIcon } from "lucide-react";
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
    <div className="flex flex-row py-1.5">
      {onMarkAsRead && (
        <div className="min-h-full w-1 shrink-0 rounded-r-lg bg-primary" />
      )}
      <div className="flex w-full flex-row justify-between gap-2 border-b px-4 py-2 transition-colors last:border-b-0">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-1">
            <p className="text-sm">{notification.description}</p>
            {timeAgo && (
              <p className="text-muted-foreground text-xs">{timeAgo}</p>
            )}
            <div className="flex flex-row justify-between gap-2 pt-1">
              <Button asChild className="px-0" size="sm" variant="link">
                <a
                  href={notification.ctaUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {notification.ctaText}
                </a>
              </Button>
            </div>
          </div>
        </div>
        {onMarkAsRead && (
          <Button
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onMarkAsRead(notification.id)}
            size="icon"
            variant="ghost"
          >
            <ArchiveIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
