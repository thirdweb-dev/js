"use client";

import { ToggleThemeButton } from "@/components/color-mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { EmptyStateChatPageContent } from "../(app)/components/EmptyStateChatPageContent";
import { NebulaIcon } from "../(app)/icons/NebulaIcon";
import { NebulaLoginPage } from "./NebulaConnectEmbedLogin";

export function NebulaLoggedOutStatePage(props: {
  params: {
    chain: string | string[] | undefined;
    q: string | undefined;
    wallet: string | undefined;
  };
  hasAuthToken: boolean;
}) {
  const [message, setMessage] = useState<string | undefined>(props.params.q);
  const [showPage, setShowPage] = useState<"connect" | "welcome">(
    props.hasAuthToken ? "connect" : "welcome",
  );

  const redirectPathObj = {
    chain: props.params.chain,
    q: message, // don't use props.params.q, because message may be updated by user
    wallet: props.params.wallet,
  };

  const redirectPathParams = Object.entries(redirectPathObj)
    .map(([key, value]) => {
      if (!value) {
        return "";
      }

      if (Array.isArray(value)) {
        return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
      }

      return `${key}=${encodeURIComponent(value)}`;
    })
    .filter((v) => v !== "")
    .join("&");

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      {/* nav */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between p-4">
          <div className="flex shrink-0 items-center gap-2 ">
            <NebulaIcon className="size-7 text-foreground" />
            <span className="font-bold text-xl tracking-tight">Nebula</span>
          </div>

          <div className="flex items-center gap-6">
            <ToggleThemeButton />

            <Link
              href="https://thirdweb.com/support"
              className="hidden text-muted-foreground text-sm hover:text-foreground lg:block"
              target="_blank"
            >
              Support
            </Link>

            <Link
              href="https://portal.thirdweb.com/"
              className="hidden text-muted-foreground text-sm hover:text-foreground lg:block"
              target="_blank"
            >
              Docs
            </Link>

            {showPage === "welcome" && (
              <Button size="sm" onClick={() => setShowPage("connect")}>
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>

      {showPage === "connect" && (
        <NebulaLoginPage redirectPath={`/?${redirectPathParams}`} />
      )}

      {showPage === "welcome" && (
        <div className="container relative flex max-w-[800px] grow flex-col justify-center overflow-hidden rounded-lg pb-6">
          <EmptyStateChatPageContent
            prefillMessage={message}
            sendMessage={(msg) => {
              setMessage(msg);
              setShowPage("connect");
            }}
          />
        </div>
      )}
    </div>
  );
}
