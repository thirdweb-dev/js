"use client";

import { MessageCircleIcon, XIcon } from "lucide-react";
import { useSelectedLayoutSegments } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { createThirdwebClient } from "thirdweb";
import type { Team } from "@/api/team/get-team";
import { Button } from "@/components/ui/button";
import { NEXT_PUBLIC_DASHBOARD_CLIENT_ID } from "@/constants/public-envs";
import { cn } from "@/lib/utils";
import CustomChatContent from "./CustomChatContent";

// Create a thirdweb client for the chat functionality
const client = createThirdwebClient({
  clientId: NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
});

export function CustomChatButton(props: {
  label: string;
  examplePrompts: string[];
  authToken: string;
  team: Team;
  clientId: string | undefined;
}) {
  const layoutSegments = useSelectedLayoutSegments();
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const ref = useRef<HTMLDivElement>(null);

  if (layoutSegments[0] === "~" && layoutSegments[1] === "support") {
    return null;
  }

  return (
    <>
      {/* Inline Button (not floating) */}
      <Button
        className="gap-2 rounded-full shadow-lg"
        onClick={() => {
          setIsOpen(true);
          setHasBeenOpened(true);
        }}
        variant="default"
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
        <div className="flex items-center justify-between border-b px-4 py-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <MessageCircleIcon className="size-5 text-muted-foreground" />
            {props.label}
          </div>
          <Button
            aria-label="Close chat"
            className="h-auto w-auto p-1 text-muted-foreground rounded-full"
            onClick={closeModal}
            size="icon"
            variant="ghost"
          >
            <XIcon className="size-5" />
          </Button>
        </div>
        {/* Chat Content */}
        <div className="relative flex grow flex-col overflow-hidden">
          {hasBeenOpened && isOpen && (
            <CustomChatContent
              authToken={props.authToken}
              client={client}
              clientId={props.clientId}
              examplePrompts={props.examplePrompts.map((prompt) => ({
                message: prompt,
                title: prompt,
              }))}
              team={props.team}
            />
          )}
        </div>
      </div>
    </>
  );
}
