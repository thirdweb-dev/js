"use client";

import Link from "next/link";
import { useState } from "react";
import { EmptyStateChatPageContent } from "../(app)/components/EmptyStateChatPageContent";
import { NebulaIcon } from "../(app)/icons/NebulaIcon";
import { Button } from "../../../@/components/ui/button";
import type { Account } from "../../../@3rdweb-sdk/react/hooks/useApi";
import { LoginAndOnboardingPageContent } from "../../login/LoginPage";

export function NebulaLoginPage(props: {
  account: Account | undefined;
}) {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [showPage, setShowPage] = useState<"connect" | "welcome">(
    props.account ? "connect" : "welcome",
  );
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      {/* nav */}
      <header className="border-b">
        <div className="container flex items-center justify-between p-4">
          <NebulaIcon className="size-8 shrink-0 text-foreground" />

          <div className="flex items-center gap-7">
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
          account={props.account}
          redirectPath={
            message ? `/?prompt=${encodeURIComponent(message)}` : "/"
          }
        />
      )}

      {showPage === "welcome" && (
        <div className="container relative flex max-w-[800px] grow flex-col justify-center overflow-hidden rounded-lg pb-6">
          <EmptyStateChatPageContent
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
