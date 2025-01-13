"use client";

import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "../../../../@/components/ui/button";
import { NebulaIcon } from "../icons/NebulaIcon";
import { ChatBar } from "./ChatBar";

export function EmptyStateChatPageContent(props: {
  sendMessage: (message: string) => void;
}) {
  return (
    <div className="py-16">
      <div className="relative py-10">
        <FancyBorders />
        <div className="flex justify-center">
          <div className="rounded-lg border p-1">
            <div className="rounded border bg-muted p-1.5">
              <NebulaIcon className="size-7 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="h-5" />
        <h1 className="px-4 text-center font-semibold text-3xl tracking-tight md:text-4xl">
          How can I help you <br className="max-sm:hidden" />
          with the blockchain today?
        </h1>
        <div className="h-5" />
        <div className="mx-auto max-w-[600px]">
          <ChatBar
            sendMessage={props.sendMessage}
            isChatStreaming={false}
            abortChatStream={() => {
              // the page will switch so, no need to handle abort here
            }}
          />
          <div className="h-5" />
          <div className="flex flex-wrap justify-center gap-2.5">
            <ExamplePrompt
              label="USDC contract address on ethereum"
              onClick={() => {
                props.sendMessage(
                  "What is the contract address of USDC on ethereum?",
                );
              }}
            />

            <ExamplePrompt
              label="last 5 blocks on polygon"
              onClick={() => {
                props.sendMessage("What are last 5 blocks on polygon?");
              }}
            />

            <ExamplePrompt
              label="What is thirdweb SDK?"
              onClick={() => {
                props.sendMessage("What is thirdweb SDK?");
              }}
            />
            <ExamplePrompt
              label="How to add connect wallet button"
              onClick={() => {
                props.sendMessage(
                  "How to add connect wallet button on React app?",
                );
              }}
            />
            <ExamplePrompt
              label="Show transaction details"
              onClick={() => {
                props.sendMessage(
                  "Show transaction details of 0xff9624116c352c8b090203fbbb563baf32d2b1944f9ac281ff2de6b7d948030e on ethereum",
                );
              }}
            />
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
      className="h-auto gap-1.5 rounded-full bg-muted/50 px-3 py-1 text-muted-foreground text-xs"
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
      className={props.className}
      style={{
        backgroundImage: `linear-gradient(${props.type === "horizontal" ? "90deg" : "180deg"}, hsl(var(--foreground)/20%) 0 30%, transparent 0 100%)`,
        backgroundRepeat: "repeat",
        backgroundSize: "10px 10px",
        maskImage: `linear-gradient(${
          props.type === "horizontal" ? "to right" : "to bottom"
        }, rgba(0,0,0,0.1), black 20%, black 80%, rgba(0,0,0,0.1))`,
      }}
    />
  );
}
