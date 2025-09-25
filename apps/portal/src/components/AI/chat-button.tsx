"use client";

import { BrainIcon, RefreshCcwIcon, XIcon } from "lucide-react";
import { lazy, Suspense, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

const Chat = lazy(() =>
  import("./chat").then((mod) => ({ default: mod.Chat })),
);

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const [id, setId] = useState(0);

  return (
    <>
      {/* Inline Button (not floating) */}
      <Button
        className="gap-2 rounded-full bg-background"
        onClick={() => {
          setIsOpen(true);
          setHasBeenOpened(true);
        }}
        variant="outline"
      >
        <BrainIcon className="size-4 text-muted-foreground" />
        Ask AI
      </Button>

      {/* Popup/Modal */}
      <div
        className={cn(
          "slide-in-from-bottom-20 zoom-in-95 fade-in-0 fixed bottom-0 left-0 z-modal flex h-[80vh] w-[100vw] animate-in flex-col overflow-hidden rounded-t-2xl border bg-background shadow-2xl duration-200 lg:right-6 lg:bottom-6 lg:left-auto lg:h-[80vh] lg:max-w-xl lg:rounded-xl",
          !isOpen && "hidden",
        )}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2 font-medium text-lg pl-0.5">
            Ask AI
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="size-auto p-1 text-muted-foreground rounded-full"
              onClick={() => setId((x) => x + 1)}
              size="icon"
              aria-label="Reset chat"
              variant="ghost"
            >
              <RefreshCcwIcon className="size-5" />
            </Button>

            <Button
              aria-label="Close chat"
              className="size-auto p-1 text-muted-foreground rounded-full"
              onClick={closeModal}
              size="icon"
              variant="ghost"
            >
              <XIcon className="size-5" />
            </Button>
          </div>
        </div>
        {/* Chat Content */}
        <div className="flex grow flex-col overflow-hidden relative">
          {hasBeenOpened && (
            <Suspense fallback={<ChatLoading />}>
              <Chat key={id} />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
}

function ChatLoading() {
  return (
    <div className="flex items-center justify-center p-8 absolute inset-0">
      <Spinner className="size-10" />
    </div>
  );
}
