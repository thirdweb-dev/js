"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { TruncatedSessionInfo } from "../api/types";
import { ChatSidebar } from "./ChatSidebar";

export function MobileNav(props: {
  sessions: TruncatedSessionInfo[];
  authToken: string;
  client: ThirdwebClient;
  team_slug: string;
  project: Project;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const newChatPage = `/team/${props.team_slug}/${props.project.slug}/ai`;

  return (
    <nav className="flex justify-end border-b bg-background px-4 py-2 lg:hidden gap-4">
      <div className="flex items-center gap-5">
        <Button asChild className="h-auto w-auto rounded-md px-2.5 py-1.5">
          <Link href={newChatPage}>New Chat</Link>
        </Button>
      </div>
      <Sheet onOpenChange={setIsOpen} open={isOpen}>
        <SheetTrigger asChild>
          <Button
            className="h-auto w-auto p-0.5"
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
          >
            <MenuIcon className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-[calc(100vw-80px)] max-w-[300px] p-0"
          onClick={(e) => {
            if (!(e.target instanceof HTMLElement)) {
              return;
            }
            if (
              e.target instanceof HTMLAnchorElement ||
              e.target.closest("a")
            ) {
              setIsOpen(false);
            }
          }}
          side="right"
        >
          <SheetTitle className="sr-only"> Menu </SheetTitle>
          <ChatSidebar
            project={props.project}
            team_slug={props.team_slug}
            client={props.client}
            sessions={props.sessions}
            type="mobile"
          />
        </SheetContent>
      </Sheet>
    </nav>
  );
}
