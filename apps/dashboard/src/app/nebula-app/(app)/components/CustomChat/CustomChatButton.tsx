"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircleIcon, XIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { ExamplePrompt } from "../../data/examplePrompts";
import CustomChatContent from "./CustomChatContent";

export function CustomChatButton(props: {
  isLoggedIn: boolean;
  networks: "mainnet" | "testnet" | "all" | null;
  isFloating: boolean;
  pageType: "chain" | "contract" | "support";
  label: string;
  client: ThirdwebClient;
  customApiParams: any;
  examplePrompts: ExamplePrompt[];
  authToken: string | undefined;
  requireLogin?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  // (optional: can add if you want exact Nebula behavior)
  // useEffect(() => { ... }, [onOutsideClick]);

  if (isDismissed) {
    return null;
  }

  return (
    <>
      {/* Inline Button (not floating) */}
      <Button
        onClick={() => {
          setIsOpen(true);
          setHasBeenOpened(true);
        }}
        variant="default"
        className="gap-2 rounded-full shadow-lg"
      >
        <MessageCircleIcon className="size-4" />
        {props.label}
      </Button>

      {/* Popup/Modal */}
      <div
        className={cn(
          "slide-in-from-bottom-20 zoom-in-95 fade-in-0 fixed bottom-0 left-0 z-50 flex h-[80vh] w-[100vw] animate-in flex-col overflow-hidden rounded-t-2xl border bg-background shadow-2xl duration-200 lg:right-6 lg:bottom-6 lg:left-auto lg:h-[80vh] lg:max-w-xl lg:rounded-xl",
          !isOpen && "hidden",
        )}
        ref={ref}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b px-4 py-2">
          <div className="font-semibold text-lg flex items-center gap-2">
            <MessageCircleIcon className="size-5 text-muted-foreground" />
            {props.label}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeModal}
            className="h-auto w-auto p-1 text-muted-foreground"
            aria-label="Close chat"
          >
            <XIcon className="size-5" />
          </Button>
        </div>
        {/* Chat Content */}
        <div className="relative flex grow flex-col overflow-hidden">
          {hasBeenOpened && isOpen && (
            <CustomChatContent
              authToken={props.authToken}
              client={props.client}
              examplePrompts={props.examplePrompts}
              pageType={props.pageType}
              customApiParams={props.customApiParams}
              networks={props.networks}
              requireLogin={props.requireLogin}
            />
          )}
        </div>
      </div>
    </>
  );
}
