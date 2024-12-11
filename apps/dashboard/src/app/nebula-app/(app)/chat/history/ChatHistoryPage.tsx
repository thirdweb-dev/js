"use client";

import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import Fuse from "fuse.js";
import {
  EllipsisIcon,
  MessageCircleIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { deleteSession } from "../../api/session";
import type { TruncatedSessionInfo } from "../../api/types";
import { useSessionsWithLocalOverrides } from "../../hooks/useSessionsWithLocalOverrides";
import { deletedSessionsStore } from "../../stores";

export function ChatHistoryPage(props: {
  sessions: TruncatedSessionInfo[];
  prefillSearch?: string;
  authToken: string;
}) {
  return (
    <ChatHistoryPageUI
      {...props}
      deleteSession={async (s) => {
        await deleteSession({ sessionId: s, authToken: props.authToken });
      }}
    />
  );
}

export function ChatHistoryPageUI(props: {
  sessions: TruncatedSessionInfo[];
  prefillSearch?: string;
  deleteSession: (sessionId: string) => Promise<void>;
}) {
  const [searchVal, setSearchVal] = useState(props.prefillSearch ?? "");
  const allSessions = useSessionsWithLocalOverrides(props.sessions);

  const fuse = useMemo(() => {
    return new Fuse(allSessions, {
      keys: [
        {
          name: "title",
          weight: 1,
        },
      ],
      threshold: 0.5,
    });
  }, [allSessions]);

  const filteredSessions = useMemo(() => {
    if (!searchVal) {
      return allSessions;
    }

    return fuse.search(searchVal).map((e) => e.item);
  }, [allSessions, searchVal, fuse]);
  return (
    <div className="flex grow flex-col overflow-hidden">
      <header className="border-b py-4">
        <h1 className="px-6 font-semibold text-lg tracking-tight">All Chats</h1>
      </header>
      <SearchInput
        placeholder="Search for a chat"
        value={searchVal}
        onValueChange={setSearchVal}
      />

      {filteredSessions.length > 0 && (
        <ScrollShadow
          className="container flex-1"
          scrollableClassName="max-h-full py-6"
          shadowColor="hsl(var(--background))"
        >
          {filteredSessions.length > 0 && (
            <div className="flex flex-col gap-4">
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id + session.updated_at + session.created_at}
                  session={session}
                  deleteSession={props.deleteSession}
                />
              ))}
            </div>
          )}
        </ScrollShadow>
      )}

      {/* No Search Results */}
      {allSessions.length > 0 && filteredSessions.length === 0 && (
        <div className="flex grow flex-col justify-center rounded-lg">
          <div className="flex flex-col items-center">
            <div className="rounded-xl border bg-muted/50 p-2">
              <MessageCircleIcon className="size-5 text-muted-foreground" />
            </div>
            <div className="h-4" />
            <h3 className="text-center"> No Chats Found </h3>
            <div className="h-1" />
            <p className="text-center text-muted-foreground text-sm">
              Try a different search term
            </p>
          </div>
        </div>
      )}

      {/* No Chats at all */}
      {allSessions.length === 0 && (
        <div className="flex grow flex-col justify-center">
          <div className="flex flex-col items-center">
            <div className="rounded-xl border bg-muted/50 p-2">
              <MessageCircleIcon className="size-5 text-muted-foreground" />
            </div>
            <div className="h-4" />
            <h3 className="text-center"> No Chats Created </h3>
            <div className="h-1" />
            <p className="text-center text-muted-foreground text-sm">
              Start a new chat to get started.
            </p>
            <div className="h-5" />
            <Button asChild size="sm">
              <Link href="/">New Chat</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchInput(props: {
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Input
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onValueChange(e.target.value)}
        className="!border-b h-auto rounded-none border-0 px-6 py-4 pl-11 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-5 size-4 text-muted-foreground" />
    </div>
  );
}

// TODO - add delete chat confirmation dialog

function SessionCard(props: {
  session: TruncatedSessionInfo;
  deleteSession: (sessionId: string) => Promise<void>;
}) {
  const deleteChat = useMutation({
    mutationFn: () => {
      return props.deleteSession(props.session.id);
    },
    onSuccess: () => {
      const prev = deletedSessionsStore.getValue();
      deletedSessionsStore.setValue([...prev, props.session.id]);
    },
  });

  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <h3>{props.session.title}</h3>
      <div className="mt-4 flex items-center justify-between gap-6 border-t pt-3">
        <p className="text-muted-foreground text-sm">
          Updated{" "}
          {formatDistance(new Date(props.session.updated_at), new Date(), {
            addSuffix: true,
          })}
        </p>

        <Popover>
          <PopoverTrigger asChild>
            <Button className="h-auto w-auto p-1.5" variant="ghost">
              <EllipsisIcon className="size-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-1" side="top" align="end">
            <Button
              variant="ghost"
              className="!text-destructive-text flex w-full justify-start gap-2.5 px-2"
              onClick={() => {
                const promise = deleteChat.mutateAsync();
                toast.promise(promise, {
                  success: "Chat deleted successfully",
                  error: "Failed to delete chat",
                });
              }}
            >
              {deleteChat.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <TrashIcon className="size-4" />
              )}
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
