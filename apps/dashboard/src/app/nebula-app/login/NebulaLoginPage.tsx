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
  const [showLoginPage, setShowLoginPage] = useState<boolean>(false);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
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

            {!showLoginPage && (
              <Button size="sm" onClick={() => setShowLoginPage(true)}>
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>

      {showLoginPage ? (
        <LoginAndOnboardingPageContent
          account={props.account}
          redirectPath={
            message ? `/?prompt=${encodeURIComponent(message)}` : "/"
          }
        />
      ) : (
        <div className="container relative flex max-w-[800px] grow flex-col justify-center overflow-hidden rounded-lg pb-6">
          <EmptyStateChatPageContent
            sendMessage={(msg) => {
              setMessage(msg);
              setShowLoginPage(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
