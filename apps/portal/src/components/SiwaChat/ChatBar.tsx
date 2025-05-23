"use client";

import { ArrowUpIcon, CircleStopIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
// NOTE: You will need to update these imports to match your portal's structure or stub them if not available
import { Button } from "../ui/button";
import { AutoResizeTextarea } from "../ui/textarea";
import type { NebulaUserMessage } from "./types";

// Define proper TypeScript interfaces
interface ChatContext {
  chainId?: number;
  contractAddress?: string;
  functionName?: string;
  parameters?: Record<string, unknown>;
  [key: string]: unknown;
}

interface ConnectedWallet {
  address: string;
  walletId: string;
  chainId?: number;
  isActive?: boolean;
}

// Props interfaces for better organization
interface MessageHandlingProps {
  sendMessage: (message: NebulaUserMessage) => void;
  prefillMessage?: string;
  placeholder: string;
}

interface ChatStateProps {
  isChatStreaming: boolean;
  abortChatStream: () => void;
  isConnectingWallet: boolean;
}

interface WalletProps {
  connectedWallets: ConnectedWallet[];
  setActiveWallet: (wallet: ConnectedWallet) => void;
}

interface ContextProps {
  context: ChatContext | undefined;
  setContext: (context: ChatContext | undefined) => void;
  showContextSelector: boolean;
}

interface UIProps {
  className?: string;
  onLoginClick?: () => void;
}

// Combined props interface
interface ChatBarProps
  extends MessageHandlingProps,
    ChatStateProps,
    Partial<WalletProps>,
    Partial<ContextProps>,
    UIProps {}

export function ChatBar(props: ChatBarProps) {
  const [message, setMessage] = useState(props.prefillMessage || "");

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const userMessage: NebulaUserMessage = {
      role: "user",
      content: [{ type: "text", text: message }],
    };

    props.sendMessage(userMessage);
    setMessage("");
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card",
        props.className,
      )}
    >
      <div className="p-2">
        <MessageInput
          message={message}
          setMessage={setMessage}
          placeholder={props.placeholder}
          isChatStreaming={props.isChatStreaming}
          onSend={handleSendMessage}
        />
        <ChatActions
          isChatStreaming={props.isChatStreaming}
          isConnectingWallet={props.isConnectingWallet}
          abortChatStream={props.abortChatStream}
          onSendMessage={handleSendMessage}
          canSend={message.trim() !== ""}
        />
      </div>
    </div>
  );
}

// Updated MessageInput component
interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  placeholder: string;
  isChatStreaming: boolean;
  onSend: () => void;
}

function MessageInput({
  message,
  setMessage,
  placeholder,
  isChatStreaming,
  onSend,
}: MessageInputProps) {
  return (
    <div className="max-h-[200px] overflow-y-auto">
      <AutoResizeTextarea
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.shiftKey) return;
          if (e.key === "Enter" && !isChatStreaming) {
            e.preventDefault();
            onSend();
          }
        }}
        className="min-h-[60px] resize-none border-none bg-transparent pt-2 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={isChatStreaming}
      />
    </div>
  );
}

// Updated ChatActions component
interface ChatActionsProps {
  isChatStreaming: boolean;
  isConnectingWallet: boolean;
  abortChatStream: () => void;
  onSendMessage: () => void;
  canSend: boolean;
}

function ChatActions({
  isChatStreaming,
  isConnectingWallet,
  abortChatStream,
  onSendMessage,
  canSend,
}: ChatActionsProps) {
  return (
    <div className="flex items-end justify-between gap-3 px-2 pb-2">
      <div className="grow" />
      <div className="flex items-center gap-2">
        {isChatStreaming ? (
          <StopButton onStop={abortChatStream} />
        ) : (
          <SendButton
            onSend={onSendMessage}
            disabled={!canSend || isConnectingWallet}
          />
        )}
      </div>
    </div>
  );
}

// Decomposed component for stop button
interface StopButtonProps {
  onStop: () => void;
}

function StopButton({ onStop }: StopButtonProps) {
  return (
    <Button
      variant="default"
      className="!h-auto w-auto shrink-0 gap-2 p-2"
      onClick={onStop}
      aria-label="Stop generating"
    >
      <CircleStopIcon className="size-4" />
      Stop
    </Button>
  );
}

// Decomposed component for send button
interface SendButtonProps {
  onSend: () => void;
  disabled: boolean;
}

function SendButton({ onSend, disabled }: SendButtonProps) {
  return (
    <Button
      aria-label="Send"
      disabled={disabled}
      className="!h-auto w-auto border border-nebula-pink-foreground p-2 disabled:opacity-100"
      variant="pink"
      onClick={onSend}
    >
      <ArrowUpIcon className="size-4" />
    </Button>
  );
}
