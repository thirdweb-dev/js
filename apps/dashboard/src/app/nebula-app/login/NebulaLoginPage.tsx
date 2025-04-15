"use client";

import { ToggleThemeButton } from "@/components/color-mode-toggle";
import { Button } from "@/components/ui/button";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import Link from "next/link";
import { useState } from "react";
import { EmptyStateChatPageContent } from "../(app)/components/EmptyStateChatPageContent";
import { NebulaIcon } from "../(app)/icons/NebulaIcon";
import { LoginAndOnboardingPageContent } from "../../login/LoginPage";

export function NebulaLoginPage(props: {
  account: Account | undefined;
  params: {
    chain: string | string[] | undefined;
    q: string | undefined;
    wallet: string | undefined;
  };
}) {
  const [message, setMessage] = useState<string | undefined>(props.params.q);
  const [showPage, setShowPage] = useState<"connect" | "welcome">(
    props.account ? "connect" : "welcome",
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
          <NebulaIcon className="size-8 shrink-0 text-foreground" />

          <div className="flex items-center gap-6">
            <ToggleThemeButton />

            <Link
              href="https://thirdweb.com/support"
              className="text-muted-foreground text-sm hover:text-foreground"
              target="_blank"
            >
              Support
            </Link>

            <Link
              href="https://portal.thirdweb.com/"
              className="text-muted-foreground text-sm hover:text-foreground"
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
        <LoginAndOnboardingPageContent
          loginWithInAppWallet={false}
          account={props.account}
          redirectPath={`/?${redirectPathParams}`}
        />
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
