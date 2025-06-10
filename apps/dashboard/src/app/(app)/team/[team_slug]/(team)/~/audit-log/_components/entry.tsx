"use client";

import type { AuditLogEntry } from "@/api/audit-log";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { KeyIcon, SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";

interface AuditLogEntryProps {
  entry: AuditLogEntry;
}

export function AuditLogEntryComponent({ entry }: AuditLogEntryProps) {
  return (
    <div className="group -mx-4 border-border/40 border-b p-4 transition-colors last:border-b-0 hover:bg-muted/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Actor indicator */}
          <Avatar className="size-10">
            <AvatarImage src={entry.who.metadata?.image} />
            <AvatarFallback>{getInitials(entry.who.text)}</AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-1">
            {/* Main action line */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-medium text-sm">{entry.who.text}</span>
              <span className="text-muted-foreground text-sm">
                {entry.what.action}d
              </span>
              {entry.what.path ? (
                <Link
                  href={entry.what.path}
                  className="font-medium text-sm hover:underline"
                >
                  {entry.what.text}
                </Link>
              ) : (
                <span className="text-muted-foreground text-sm">
                  {entry.what.text}
                </span>
              )}
              {entry.what.in && (
                <>
                  <span className="text-muted-foreground text-sm">in</span>
                  {entry.what.in.path ? (
                    <Link
                      href={entry.what.in.path}
                      className="font-medium text-sm hover:underline"
                    >
                      {entry.what.in.text}
                    </Link>
                  ) : (
                    <span className="font-medium text-sm">
                      {entry.what.in.text}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            {entry.what.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {entry.what.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <div className="flex items-center gap-1">
                {getTypeIcon(entry.who.type)}
                <span className="capitalize">{entry.who.type}</span>
              </div>
              {entry.who.metadata?.email && (
                <span>{entry.who.metadata.email}</span>
              )}
              {entry.who.metadata?.wallet && (
                <span className="font-mono">
                  {entry.who.metadata.wallet.slice(0, 6)}...
                  {entry.who.metadata.wallet.slice(-4)}
                </span>
              )}
              {entry.who.metadata?.clientId && (
                <span>Client: {entry.who.metadata.clientId}</span>
              )}
            </div>
          </div>
        </div>

        {/* Timestamp and action badge */}
        <div className="flex items-center gap-3 text-right">
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
              {entry.what.action}
            </span>
            <span className="whitespace-nowrap text-muted-foreground text-xs">
              {formatDistanceToNow(entry.when, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTypeIcon(type: AuditLogEntry["who"]["type"]) {
  switch (type) {
    case "user":
      return <UserIcon className="h-3.5 w-3.5" />;
    case "apikey":
      return <KeyIcon className="h-3.5 w-3.5" />;
    case "system":
      return <SettingsIcon className="h-3.5 w-3.5" />;
    default:
      return <UserIcon className="h-3.5 w-3.5" />;
  }
}

function getInitials(text: string) {
  return text
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
