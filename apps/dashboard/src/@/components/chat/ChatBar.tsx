"use client";
import { ArrowUpIcon, CircleStopIcon, PaperclipIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { NebulaUserMessage } from "./types";

export function ChatBar(props: {
  sendMessage: (message: NebulaUserMessage) => void;
  isChatStreaming: boolean;
  abortChatStream: () => void;
  prefillMessage: string | undefined;
  className?: string;
  client: ThirdwebClient;
  isConnectingWallet: boolean;
  onLoginClick: undefined | (() => void);
  placeholder: string;
}) {
  const [message, setMessage] = useState(props.prefillMessage || "");

  function handleSubmit(message: string) {
    const userMessage: NebulaUserMessage = {
      content: [{ text: message, type: "text" }],
      role: "user",
    };

    props.sendMessage(userMessage);
    setMessage("");
  }

  return (
    <DynamicHeight transition="height 200ms ease">
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card transition-colors",
          props.className,
        )}
      >
        <div className="p-2">
          <div className="max-h-[200px] overflow-y-auto">
            <AutoResizeTextarea
              className="min-h-[60px] resize-none border-none bg-transparent pt-2 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={props.isChatStreaming}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                // ignore if shift key is pressed to allow entering new lines
                if (e.shiftKey) {
                  return;
                }
                if (e.key === "Enter" && !props.isChatStreaming) {
                  e.preventDefault();
                  handleSubmit(message);
                }
              }}
              placeholder={props.placeholder}
              value={message}
            />
          </div>

          <div className="flex items-end justify-between gap-3 px-2 pb-2">
            {/* left */}
            <div className="grow" />

            {/* right */}
            <div className="flex items-center gap-2">
              {props.onLoginClick ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="!h-auto w-auto shrink-0 gap-2 p-2"
                      variant="ghost"
                    >
                      <ToolTipLabel label="Attach Image">
                        <PaperclipIcon className="size-4" />
                      </ToolTipLabel>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72">
                    <div>
                      <p className="mb-3 text-muted-foreground text-sm">
                        Get access to image uploads by signing in to Nebula
                      </p>
                      <Button
                        className="w-full"
                        onClick={props.onLoginClick}
                        variant="default"
                      >
                        Sign in
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : null}

              {/* Send / Stop */}
              {props.isChatStreaming ? (
                <Button
                  className="!h-auto w-auto shrink-0 gap-2 p-2"
                  onClick={() => {
                    props.abortChatStream();
                  }}
                  variant="default"
                >
                  <CircleStopIcon className="size-4" />
                  Stop
                </Button>
              ) : (
                <Button
                  aria-label="Send"
                  className="!h-auto w-auto p-2 disabled:opacity-100"
                  disabled={message.trim() === "" || props.isConnectingWallet}
                  onClick={() => {
                    if (message.trim() === "") return;
                    handleSubmit(message);
                  }}
                >
                  <ArrowUpIcon className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DynamicHeight>
  );
}
