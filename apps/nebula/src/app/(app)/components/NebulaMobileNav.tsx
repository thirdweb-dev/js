"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { TruncatedSessionInfo } from "../api/types";
import { useNewChatPageLink } from "../hooks/useNewChatPageLink";
import { ChatSidebar } from "./ChatSidebar";

export function MobileNav(props: {
  sessions: TruncatedSessionInfo[];
  authToken: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const newChatPage = useNewChatPageLink();

  return (
    <nav className="flex justify-between border-b bg-card px-4 py-4 lg:hidden">
      <Sheet onOpenChange={setIsOpen} open={isOpen}>
        <SheetTrigger asChild>
          <Button
            className="h-auto w-auto p-0.5"
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
          >
            <MenuIcon className="size-8" />
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
          side="left"
        >
          <SheetTitle className="sr-only"> Menu </SheetTitle>
          <ChatSidebar
            authToken={props.authToken}
            sessions={props.sessions}
            type="mobile"
          />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-5">
        <Button asChild className="h-auto w-auto rounded-lg px-2.5 py-1.5">
          <Link href={newChatPage}>New Chat</Link>
        </Button>
      </div>
    </nav>
  );
}
