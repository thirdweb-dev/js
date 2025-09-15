"use client";

import Link from "next/link";
import { useState } from "react";
import { ToggleThemeButton } from "@/components/color-mode-toggle";
import { Button } from "@/components/ui/button";
import { NebulaIcon } from "@/icons/NebulaIcon";
import { EmptyStateChatPageContent } from "../(app)/components/EmptyStateChatPageContent";
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
              className="hidden text-muted-foreground text-sm hover:text-foreground lg:block"
              href="https://thirdweb.com/support"
              target="_blank"
            >
              Support
            </Link>

            <Link
              className="hidden text-muted-foreground text-sm hover:text-foreground lg:block"
              href="https://portal.thirdweb.com/"
              target="_blank"
            >
              Docs
            </Link>

            {showPage === "welcome" && (
              <Button onClick={() => setShowPage("connect")} size="sm">
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Deprecation banner */}
      <div className="bg-destructive p-6">
        <div className="container text-md text-destructive-foreground">
          <h4 className="font-bold text-lg">
            Nebula is now{" "}
            <Link
              className="underline text-destructive-foreground hover:text-destructive-foreground/80"
              href="https://thirdweb.com/ai"
              target="_blank"
            >
              thirdweb AI.
            </Link>{" "}
            This site will be deprecated on September 30, 2025.
          </h4>
          <p>
            To continue using thirdweb AI, please sign in to the{" "}
            <Link
              className="underline text-destructive-foreground hover:text-destructive-foreground/80"
              href="https://thirdweb.com/login"
              target="_blank"
            >
              thirdweb dashboard
            </Link>{" "}
            and create a new project.
          </p>
          <p>
            If you have any funds left in your Nebula account, please withdraw
            them before September 30, 2025.
          </p>
        </div>
      </div>

      {showPage === "connect" && (
        <NebulaLoginPage redirectPath={`/?${redirectPathParams}`} />
      )}

      {showPage === "welcome" && (
        <div className="container relative flex max-w-[800px] grow flex-col justify-center overflow-hidden rounded-lg pb-6">
          <EmptyStateChatPageContent
            allowImageUpload={false}
            connectedWallets={[]}
            context={{
              chainIds: chainIds.map((x) => x.toString()),
              networks: null,
              walletAddress: null,
            }}
            isConnectingWallet={false}
            onLoginClick={() => {
              setShowPage("connect");
            }}
            prefillMessage={props.params.q}
            sendMessage={(msg) => {
              const textMessage = msg.content.find((x) => x.type === "text");
              if (textMessage) {
                setMessage(textMessage.text);
              }
              setShowPage("connect");
            }}
            setActiveWallet={() => {}}
            setContext={(v) => {
              if (v?.chainIds) {
                setChainIds(v.chainIds.map(Number));
              }
            }}
            showAurora={false}
          />
        </div>
      )}
    </div>
  );
}
