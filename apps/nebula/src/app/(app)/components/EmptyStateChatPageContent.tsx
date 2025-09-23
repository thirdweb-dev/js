"use client";

import { ArrowUpRightIcon, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nebulaAppThirdwebClient } from "@/constants/nebula-client";
import { NebulaIcon } from "@/icons/NebulaIcon";
import { cn } from "@/lib/utils";
import type { NebulaContext } from "../api/chat";
import type { NebulaUserMessage } from "../api/types";
import { examplePrompts } from "../data/examplePrompts";
import { ChatBar, type WalletMeta } from "./ChatBar";

export function EmptyStateChatPageContent(props: {
  sendMessage: (message: NebulaUserMessage) => void;
  prefillMessage: string | undefined;
  context: NebulaContext | undefined;
  setContext: (context: NebulaContext | undefined) => void;
  connectedWallets: WalletMeta[];
  setActiveWallet: (wallet: WalletMeta) => void;
  isConnectingWallet: boolean;
  showAurora: boolean;
  allowImageUpload: boolean;
  onLoginClick: undefined | (() => void);
}) {
  return (
    <div className="relative overflow-hidden py-10 lg:py-16">
      <AIUsageBanner />
      {props.showAurora && (
        <Aurora className="top-0 left-1/2 h-[800px] w-[1000px] text-[hsl(var(--nebula-pink-foreground)/8%)] lg:w-[150%] dark:text-[hsl(var(--nebula-pink-foreground)/10%)]" />
      )}
      <div className="relative py-10">
        <FancyBorders />
        <div className="flex justify-center">
          <div className="rounded-full border-[1.5px] border-nebula-pink-foreground/20 bg-[hsl(var(--nebula-pink-foreground)/5%)] p-1">
            <div className="rounded-full border-[1.5px] border-nebula-pink-foreground/40 bg-[hsl(var(--nebula-pink-foreground)/5%)] p-2">
              <NebulaIcon className="size-7 text-nebula-pink-foreground" />
            </div>
          </div>
        </div>
        <div className="h-5" />
        <h1 className="px-4 text-center font-semibold text-3xl tracking-tight md:text-4xl">
          How can I help you <br /> onchain today?
        </h1>
        <div className="h-5" />
        <div className="mx-auto max-w-[600px]">
          <ChatBar
            abortChatStream={() => {
              // the page will switch so, no need to handle abort here
            }}
            allowImageUpload={props.allowImageUpload}
            client={nebulaAppThirdwebClient}
            connectedWallets={props.connectedWallets}
            context={props.context}
            isChatStreaming={false}
            isConnectingWallet={props.isConnectingWallet}
            onLoginClick={props.onLoginClick}
            placeholder={"Ask Nebula"}
            prefillMessage={props.prefillMessage}
            sendMessage={props.sendMessage}
            setActiveWallet={props.setActiveWallet}
            setContext={props.setContext}
            showContextSelector={true}
          />
          <div className="h-5" />
          <div className="flex flex-wrap justify-center gap-2.5">
            {examplePrompts.map((prompt) => {
              return (
                <ExamplePrompt
                  key={prompt.title}
                  label={prompt.title}
                  onClick={() =>
                    props.sendMessage({
                      content: [{ text: prompt.message, type: "text" }],
                      role: "user",
                    })
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamplePrompt(props: { label: string; onClick: () => void }) {
  return (
    <Button
      className="h-auto gap-1.5 rounded-full bg-card px-3 py-1 text-muted-foreground text-xs"
      onClick={props.onClick}
      variant="outline"
    >
      {props.label} <ArrowUpRightIcon className="size-3" />
    </Button>
  );
}

function FancyBorders() {
  return (
    <>
      {/* fancy borders */}
      <div className="">
        {/* top */}
        <DashedBgDiv
          className="-translate-x-1/2 -translate-y-5 absolute top-0 right-0 left-1/2 hidden h-[1px] w-[calc(100%+200px)] lg:block"
          type="horizontal"
        />
        {/* bottom */}
        <DashedBgDiv
          className="-translate-x-1/2 absolute right-0 bottom-0 left-1/2 hidden h-[1px] w-[calc(100%+200px)] translate-y-5 lg:block"
          type="horizontal"
        />
        {/* left */}
        <DashedBgDiv
          className="-translate-y-1/2 absolute top-1/2 left-8 hidden h-[calc(100%+200px)] w-[1px] lg:block"
          type="vertical"
        />
        {/* right */}
        <DashedBgDiv
          className="-translate-y-1/2 absolute top-1/2 right-8 hidden h-[calc(100%+200px)] w-[1px] lg:block"
          type="vertical"
        />
      </div>
    </>
  );
}

function DashedBgDiv(props: {
  className?: string;
  type: "horizontal" | "vertical";
}) {
  return (
    <div
      className={cn(
        "text-nebula-pink-foreground/50 dark:text-active-border",
        props.className,
      )}
      style={{
        backgroundImage: `linear-gradient(${props.type === "horizontal" ? "90deg" : "180deg"}, currentColor 0 30%, transparent 0 100%)`,
        backgroundRepeat: "repeat",
        backgroundSize: "10px 10px",
        maskImage: `linear-gradient(${
          props.type === "horizontal" ? "to right" : "to bottom"
        }, rgba(0,0,0,0.1), black 30%, black 70%, rgba(0,0,0,0.1))`,
      }}
    />
  );
}

type AuroraProps = {
  className?: string;
};

const Aurora: React.FC<AuroraProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(ellipse at center, currentColor, transparent 60%)",
      }}
    />
  );
};

function AIUsageBanner() {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex justify-center px-4 pt-4">
      <div className="w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50/50 p-3 shadow-sm dark:border-blue-800 dark:from-blue-950/50 dark:to-blue-950/20">
          {/* Decorative blur */}
          <div className="absolute -right-6 -top-6 size-20 rounded-full bg-blue-600 opacity-10 blur-xl" />
          
          <div className="relative flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <InfoIcon className="size-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="flex-1 text-sm">
              <p className="text-blue-800 dark:text-blue-200">
                thirdweb AI usage is billable based on number of tokens used. For more details, see the{" "}
                <a
                  href="https://thirdweb.com/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 transition-colors hover:text-blue-800 hover:decoration-blue-500 dark:text-blue-300 dark:decoration-blue-600 dark:hover:text-blue-200 dark:hover:decoration-blue-400"
                >
                  pricing page
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
