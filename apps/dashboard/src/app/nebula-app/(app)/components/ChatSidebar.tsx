"use client";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import {
  ChevronRightIcon,
  FlaskConicalIcon,
  MessageSquareDashedIcon,
} from "lucide-react";
import Link from "next/link";
import type { TruncatedSessionInfo } from "../api/types";
import { useNewChatPageLink } from "../hooks/useNewChatPageLink";
import { useSessionsWithLocalOverrides } from "../hooks/useSessionsWithLocalOverrides";
import { NebulaIcon } from "../icons/NebulaIcon";
import { ChatSidebarLink } from "./ChatSidebarLink";
import { NebulaAccountButton } from "./NebulaAccountButton";

export function ChatSidebar(props: {
  sessions: TruncatedSessionInfo[];
  authToken: string;
  type: "desktop" | "mobile";
  account: Account;
}) {
  const sessions = useSessionsWithLocalOverrides(props.sessions);
  const sessionsToShow = sessions.slice(0, 10);
  const newChatPage = useNewChatPageLink();

  return (
    <div className="flex h-full flex-col p-2">
      <div className="flex items-center justify-start gap-3 p-2 lg:justify-between">
        <Link href="/">
          <NebulaIcon className="size-8 text-foreground" />
        </Link>

        <Badge variant="outline" className="gap-1">
          <FlaskConicalIcon className="size-2.5" />
          Alpha
        </Badge>
      </div>

      <div className="p-2">
        <div className="h-3" />
        <Button asChild variant="primary" className="w-full gap-2">
          <Link href={newChatPage}>
            <MessageSquareDashedIcon className="size-4" />
            New Chat
          </Link>
        </Button>
      </div>

      {sessionsToShow.length > 0 && (
        <ScrollShadow
          className="my-5 flex-1 border-t border-dashed pt-2"
          scrollableClassName="max-h-full"
          shadowColor="hsl(var(--muted))"
          shadowClassName="z-10"
        >
          <div className="flex flex-col gap-1">
            <h3 className="px-2 py-3 text-muted-foreground text-sm">
              Recent Chats
            </h3>
            {sessionsToShow.map((session) => {
              return (
                <ChatSidebarLink
                  sessionId={session.id}
                  title={session.title || session.id}
                  key={session.id}
                  authToken={props.authToken}
                />
              );
            })}

            <Link
              href="/chat/history"
              className="inline-flex items-center gap-1.5 px-2 py-3 text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
            >
              View All <ChevronRightIcon className="size-4 text-foreground" />
            </Link>
          </div>
        </ScrollShadow>
      )}

      <NebulaAccountButton
        account={props.account}
        className="mt-auto"
        type="full"
      />
    </div>
  );
}
