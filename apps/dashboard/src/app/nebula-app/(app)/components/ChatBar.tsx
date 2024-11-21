"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, CircleStopIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import type { ExecuteConfig } from "../api/types";
import ConfigForm from "./ConfigForm";

export function Chatbar(props: {
  updateConfig: (config: ExecuteConfig) => void;
  config: ExecuteConfig;
  sendMessage: (message: string) => void;
  isChatStreaming: boolean;
  abortChatStream: () => void;
}) {
  const [message, setMessage] = useState("");
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-muted/50 p-2">
      <AutoResizeTextarea
        placeholder={"Ask Nebula"}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !props.isChatStreaming) {
            setMessage("");
            props.sendMessage(message);
          }
        }}
        className="min-h-[40px] resize-none border-none bg-transparent pt-2 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={props.isChatStreaming}
      />

      <div className="flex justify-between gap-3 px-2 pb-2">
        {/* Config */}
        <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="!h-auto w-auto gap-2 px-3 py-1"
              disabled={props.isChatStreaming}
            >
              <SettingsIcon className="size-4" />
              Configure
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Execute Configuration</DialogTitle>
            </DialogHeader>
            <ConfigForm
              onSubmit={props.updateConfig}
              onClose={() => setIsConfigModalOpen(false)}
              config={props.config}
            />
          </DialogContent>
        </Dialog>

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
