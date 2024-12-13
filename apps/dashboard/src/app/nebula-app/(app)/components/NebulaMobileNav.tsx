"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { TruncatedSessionInfo } from "../api/types";
import { useNewChatPageLink } from "../hooks/useNewChatPageLink";
import { ChatSidebar } from "./ChatSidebar";

export function MobileNav(props: {
  sessions: TruncatedSessionInfo[];
  authToken: string;
  account: Account;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const newChatPage = useNewChatPageLink();

  return (
    <nav className="flex justify-between border-b bg-muted/50 px-4 py-4 lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="h-auto w-auto p-0.5"
          >
            <MenuIcon className="size-8" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
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
        >
          <SheetTitle className="sr-only"> Menu </SheetTitle>
          <ChatSidebar
            type="mobile"
            authToken={props.authToken}
            sessions={props.sessions}
            account={props.account}
          />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-5">
        <Button
          asChild
          variant="primary"
          className="h-auto w-auto rounded-lg px-2.5 py-1.5"
        >
          <Link href={newChatPage}>New Chat</Link>
        </Button>
      </div>
    </nav>
  );
}
