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
    chains: { slug: string; id: number }[];
    q: string | undefined;
  };
  hasAuthToken: boolean;
}) {
  const [showPage, setShowPage] = useState<"connect" | "welcome">(
    props.hasAuthToken ? "connect" : "welcome",
  );
  const [message, setMessage] = useState<string | undefined>(props.params.q);
  const [chainIds, setChainIds] = useState<number[]>(
    props.params.chains.map((c) => c.id),
  );

  const redirectPathObj = {
    chain: chainIds,
    q: message,
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
      <header className="border-b bg-background">
        <div className="container flex items-center justify-between p-4">
          <div className="flex shrink-0 items-center gap-1.5">
            <NebulaIcon className="size-6 text-foreground" />
            <span className="font-medium text-xl">Nebula</span>
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
            showAurora={false}
            isConnectingWallet={false}
            prefillMessage={message}
            context={{
              walletAddress: null,
              chainIds: chainIds.map((x) => x.toString()),
              networks: null,
            }}
            setContext={(v) => {
              if (v?.chainIds) {
                setChainIds(v.chainIds.map(Number));
              }
            }}
            connectedWallets={[]}
            setActiveWallet={() => {}}
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
