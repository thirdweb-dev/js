"use client";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, CircleStopIcon, PaperclipIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
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
      role: "user",
      content: [{ type: "text", text: message }],
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
              placeholder={props.placeholder}
              value={message}
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
              className="min-h-[60px] resize-none border-none bg-transparent pt-2 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={props.isChatStreaming}
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
                      variant="ghost"
                      className="!h-auto w-auto shrink-0 gap-2 p-2"
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
                        variant="default"
                        onClick={props.onLoginClick}
                        className="w-full"
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
                  variant="default"
                  className="!h-auto w-auto shrink-0 gap-2 p-2"
                  onClick={() => {
                    props.abortChatStream();
                  }}
                >
                  <CircleStopIcon className="size-4" />
                  Stop
                </Button>
              ) : (
                <Button
                  aria-label="Send"
                  disabled={message.trim() === "" || props.isConnectingWallet}
                  className="!h-auto w-auto border border-nebula-pink-foreground p-2 disabled:opacity-100"
                  variant="pink"
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
