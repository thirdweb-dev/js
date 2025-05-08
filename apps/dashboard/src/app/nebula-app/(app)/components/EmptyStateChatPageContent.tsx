"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "lucide-react";
import type { NebulaContext } from "../api/chat";
import { examplePrompts } from "../data/examplePrompts";
import { NebulaIcon } from "../icons/NebulaIcon";
import { nebulaAppThirdwebClient } from "../utils/nebulaThirdwebClient";
import { ChatBar, type WalletMeta } from "./ChatBar";

export function EmptyStateChatPageContent(props: {
  sendMessage: (message: string) => void;
  prefillMessage: string | undefined;
  context: NebulaContext | undefined;
  setContext: (context: NebulaContext | undefined) => void;
  connectedWallets: WalletMeta[];
  setActiveWallet: (wallet: WalletMeta) => void;
  isConnectingWallet: boolean;
  showAurora: boolean;
}) {
  return (
    <div className="overflow-hidden py-10 lg:py-16">
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
            isConnectingWallet={props.isConnectingWallet}
            showContextSelector={true}
            context={props.context}
            setContext={props.setContext}
            sendMessage={props.sendMessage}
            isChatStreaming={false}
            client={nebulaAppThirdwebClient}
            connectedWallets={props.connectedWallets}
            setActiveWallet={props.setActiveWallet}
            abortChatStream={() => {
              // the page will switch so, no need to handle abort here
            }}
            prefillMessage={props.prefillMessage}
          />
          <div className="h-5" />
          <div className="flex flex-wrap justify-center gap-2.5">
            {examplePrompts.map((prompt) => {
              return (
                <ExamplePrompt
                  key={prompt.title}
                  label={prompt.title}
                  onClick={() => props.sendMessage(prompt.message)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamplePrompt(props: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="h-auto gap-1.5 rounded-full bg-card px-3 py-1 text-muted-foreground text-xs"
      onClick={props.onClick}
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
