"use client";

import { MessageCircleIcon, XIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import CustomChatContent from "./CustomChatContent";

interface CustomApiParams {
  apiUrl?: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
  [key: string]: unknown; // Allow additional custom parameters
}

export function CustomChatButton(props: {
  isLoggedIn?: boolean;
  networks: "mainnet" | "testnet" | "all" | null;
  pageType: "chain" | "contract" | "support";
  label: string;
  customApiParams: CustomApiParams;
  examplePrompts: { title: string; message: string }[];
  authToken: string | undefined;
  requireLogin?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isDismissed, _setIsDismissed] = useState(false);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const ref = useRef<HTMLDivElement>(null);

  if (isDismissed) {
    return null;
  }

  return (
    <>
      {/* Floating Button (hide when modal is open) */}
      {!isOpen && (
        <Button
          onClick={() => {
            setIsOpen(true);
            setHasBeenOpened(true);
          }}
          variant="default"
          className="fixed right-6 bottom-6 z-[9999] gap-2 rounded-full shadow-lg"
          aria-label="Open chat"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <MessageCircleIcon className="size-4" />
          {props.label}
        </Button>
      )}

      {/* Popup/Modal */}
      <div
        className={cn(
          "fixed bottom-0 left-0 z-[9999] flex h-[80vh] w-[100vw] flex-col overflow-hidden rounded-t-3xl border bg-background shadow-2xl transition-all duration-200 lg:right-6 lg:bottom-6 lg:left-auto lg:h-[80vh] lg:max-w-xl lg:rounded-3xl",
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-full scale-95 opacity-0",
        )}
        ref={ref}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div
            id="chat-modal-title"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <MessageCircleIcon className="size-5 text-muted-foreground" />
            {props.label}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeModal}
            className="size-auto p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close chat"
          >
            <XIcon className="size-5" />
          </Button>
        </div>
        {/* Chat Content */}
        <div className="relative flex grow flex-col overflow-hidden rounded-b-3xl lg:rounded-b-3xl">
          {hasBeenOpened && isOpen && (
            <CustomChatContent
              examplePrompts={props.examplePrompts}
              networks={props.networks}
              requireLogin={props.requireLogin}
            />
          )}
        </div>
      </div>
    </>
  );
}
