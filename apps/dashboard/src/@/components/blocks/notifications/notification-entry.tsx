"use client";

import type { Notification } from "@/api/notifications";
import { Button } from "@/components/ui/button";
import {
  format,
  formatDistanceToNow,
  isBefore,
  parseISO,
  subDays,
} from "date-fns";
import { ArchiveIcon } from "lucide-react";
import { useMemo } from "react";

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
              <Button asChild variant="link" size="sm" className="px-0">
                <a
                  href={notification.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {notification.ctaText}
                </a>
              </Button>
            </div>
          </div>
        </div>
        {onMarkAsRead && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMarkAsRead(notification.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArchiveIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
