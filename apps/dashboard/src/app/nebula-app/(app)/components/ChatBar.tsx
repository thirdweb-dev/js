"use client";

import { Button } from "@/components/ui/button";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, CircleStopIcon } from "lucide-react";
import { useState } from "react";

export function Chatbar(props: {
  sendMessage: (message: string) => void;
  isChatStreaming: boolean;
  abortChatStream: () => void;
}) {
  const [message, setMessage] = useState("");

  return (
    <div className="rounded-2xl border border-border bg-muted/50 p-2">
      <AutoResizeTextarea
        placeholder={"Ask Nebula"}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          // ignore if shift key is pressed to allow entering new lines
          if (e.shiftKey) {
            return;
          }
          if (e.key === "Enter" && !props.isChatStreaming) {
            setMessage("");
            props.sendMessage(message);
          }
        }}
        className="min-h-[40px] resize-none border-none bg-transparent pt-2 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={props.isChatStreaming}
      />

      <div className="-mt-3 flex justify-end gap-3 px-2 pb-2">
        {/* Send / Stop */}
        {props.isChatStreaming ? (
          <Button
            variant="default"
            className="!h-auto w-auto gap-2 p-2"
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
            disabled={message.trim() === ""}
            variant="primary"
            className={cn(
              "!h-auto w-auto border border-transparent p-2 disabled:opacity-100",
              message === "" &&
                "border-border bg-muted text-muted-foreground hover:border-transparent hover:text-foreground",
            )}
            onClick={() => {
              if (message.trim() === "") return;
              setMessage("");
              props.sendMessage(message);
            }}
          >
            <ArrowUpIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
