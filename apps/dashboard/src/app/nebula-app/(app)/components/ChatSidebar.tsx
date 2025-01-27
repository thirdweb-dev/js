"use client";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import {
  FileCode2Icon,
  MessageSquareShareIcon,
  MessagesSquareIcon,
  SquareDashedBottomCodeIcon,
  TextIcon,
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
        <Link href="/" className="flex items-center gap-2">
          <NebulaIcon className="size-8 text-foreground" aria-label="Nebula" />
          <span className="font-semibold text-lg tracking-tight">
            Playground
          </span>
        </Link>

        <Badge variant="secondary" className="gap-1 py-1">
          Alpha
        </Badge>
      </div>

      <div className="h-4" />

      <div className="flex flex-col gap-2 px-2">
        <Button asChild variant="outline" className="w-full gap-2 rounded-lg">
          <Link href={newChatPage}>New Chat</Link>
        </Button>
      </div>

      <div className="h-3" />

      <SidebarIconLink
        href="https://portal.thirdweb.com/nebula/api-reference"
        icon={FileCode2Icon}
        label="API Reference"
        target="_blank"
      />

      <SidebarIconLink
        href="/chat/history"
        icon={MessagesSquareIcon}
        label="All Chats"
      />

      {sessionsToShow.length > 0 && (
        <ScrollShadow
          className="my-3 flex-1 border-t border-dashed pt-2"
          scrollableClassName="max-h-full"
          shadowColor="transparent"
          shadowClassName="z-10"
        >
          <div className="flex flex-col gap-1">
            <h3 className="px-2 py-3 text-muted-foreground text-xs">
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
          </div>
        </ScrollShadow>
      )}

      <div className="mb-3 border-y border-dashed py-3">
        <SidebarIconLink
          href="https://docs.google.com/forms/d/e/1FAIpQLSeM3fJRyywihRZUF1fiTNKEpJ_AzAcohRwXPpLr_3zxQ6W-tg/viewform?usp=sharing"
          icon={MessageSquareShareIcon}
          label="Take our quick survey!"
          target="_blank"
        />

        <SidebarIconLink
          href="https://portal.thirdweb.com/changelog"
          icon={TextIcon}
          label="Changelog"
          target="_blank"
        />

        <SidebarIconLink
          href="https://portal.thirdweb.com/nebula"
          icon={SquareDashedBottomCodeIcon}
          label="Documentation"
          target="_blank"
        />
      </div>

      <NebulaAccountButton
        account={props.account}
        className="mt-auto"
        type="full"
      />
    </div>
  );
}

function SidebarIconLink(props: {
  icon: React.FC<{ className?: string }>;
  label: string;
  target?: "_blank";
  href: string;
}) {
  return (
    <Button asChild variant="ghost">
      <Link
        href={props.href}
        target={props.target}
        className="!justify-start !px-3 w-full gap-2.5 rounded-lg text-left"
        prefetch={false}
      >
        <props.icon className="size-4" />
        {props.label}
      </Link>
    </Button>
  );
}
