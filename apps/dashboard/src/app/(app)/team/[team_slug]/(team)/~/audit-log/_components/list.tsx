"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import type { AuditLogEntry } from "@/api/audit-log";
import { Button } from "@/components/ui/button";
import { searchParams } from "../search-params";
import { AuditLogEntryComponent } from "./entry";

interface AuditLogListProps {
  entries: AuditLogEntry[];
  hasMore: boolean;
  nextCursor?: string;
}

export function AuditLogList({
  entries,
  hasMore,
  nextCursor,
}: AuditLogListProps) {
  const [isPending, startTransition] = useTransition();

  const [after, setAfter] = useQueryState(
    "after",
    searchParams.after.withOptions({
      history: "push",
      shallow: false,
      startTransition,
    }),
  );

  const showPagination = hasMore || !!after;

  return (
    <div>
      <div>
        {entries.map((log) => (
          <AuditLogEntryComponent
            entry={log}
            key={buildAuditLogEntryKey(log)}
          />
        ))}
      </div>

      {showPagination && (
        <div className="flex items-center justify-between border-t p-6">
          <Button
            disabled={isPending || !after}
            onClick={() => {
              window.history.back();
            }}
            size="sm"
            variant="outline"
          >
            {isPending ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
            )}
            Previous
          </Button>

          <Button
            disabled={!hasMore || isPending}
            onClick={() => {
              if (hasMore && nextCursor) {
                setAfter(nextCursor);
              }
            }}
            size="sm"
            variant="outline"
          >
            Next
            {isPending && hasMore ? (
              <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function buildAuditLogEntryKey(entry: AuditLogEntry) {
  return `${entry.who.type}-${entry.what.action}-${entry.what.path ?? ""}-${entry.when}-${entry.who.text}-${entry.what.resourceType}`;
}
