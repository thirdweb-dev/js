import {
  AlertCircleIcon,
  MessageCircleIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { MarkdownRenderer } from "@/components/blocks/markdown-renderer";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { cn } from "@/lib/utils";
import { Reasoning } from "./Reasoning";

// Define local types
export type UserMessageContent = { type: "text"; text: string };
export type UserMessage = {
  type: "user";
  content: UserMessageContent[];
};

export type CustomChatMessage =
  | UserMessage
  | {
      text: string;
      type: "error";
    }
  | {
      texts: string[];
      type: "presence";
    }
  | {
      request_id: string | undefined;
      text: string;
      type: "assistant";
      feedback?: 1 | -1;
    };

export function CustomChats(props: {
  messages: Array<CustomChatMessage>;
  isChatStreaming: boolean;
  authToken: string;
  sessionId: string | undefined;
  className?: string;
  client: ThirdwebClient;
  setEnableAutoScroll: (enable: boolean) => void;
  enableAutoScroll: boolean;
  useSmallText?: boolean;
  sendMessage: (message: UserMessage) => void;
  onFeedback?: (messageIndex: number, feedback: 1 | -1) => void;
}) {
  const { messages, setEnableAutoScroll, enableAutoScroll } = props;
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // auto scroll to bottom when messages change
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!enableAutoScroll || messages.length === 0) {
      return;
    }

    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, enableAutoScroll]);

  // stop auto scrolling when user interacts with chat
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!enableAutoScroll) {
      return;
    }

    const chatScrollContainer =
      chatContainerRef.current?.querySelector("[data-scrollable]");

    if (!chatScrollContainer) {
      return;
    }

    const disableScroll = () => {
      setEnableAutoScroll(false);
      chatScrollContainer.removeEventListener("mousedown", disableScroll);
      chatScrollContainer.removeEventListener("wheel", disableScroll);
    };

    chatScrollContainer.addEventListener("mousedown", disableScroll);
    chatScrollContainer.addEventListener("wheel", disableScroll);
  }, [setEnableAutoScroll, enableAutoScroll]);

  return (
    <div
      className="relative flex max-h-full flex-1 flex-col overflow-hidden"
      ref={chatContainerRef}
    >
      <ScrollShadow
        className="flex-1"
        scrollableClassName="max-h-full overscroll-contain"
        shadowClassName="z-[1]"
        shadowColor="hsl(var(--background))"
      >
        <div className="container max-w-[800px]">
          <div className={cn("flex flex-col gap-5 py-4", props.className)}>
            {props.messages.map((message, index) => {
              const isMessagePending =
                props.isChatStreaming && index === props.messages.length - 1;

              return (
                <div
                  className={cn(
                    "fade-in-0 min-w-0 animate-in pt-1 text-sm duration-300 lg:text-base",
                    props.useSmallText && "lg:text-sm",
                  )}
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique key
                  key={index}
                >
                  <RenderMessage
                    authToken={props.authToken}
                    client={props.client}
                    isMessagePending={isMessagePending}
                    message={message}
                    messageIndex={index}
                    nextMessage={props.messages[index + 1]}
                    onFeedback={props.onFeedback}
                    sendMessage={props.sendMessage}
                    sessionId={props.sessionId}
                  />
                </div>
              );
            })}
            <div ref={scrollAnchorRef} />
          </div>
        </div>
      </ScrollShadow>
    </div>
  );
}

function RenderMessage(props: {
  message: CustomChatMessage;
  messageIndex: number;
  isMessagePending: boolean;
  client: ThirdwebClient;
  sendMessage: (message: UserMessage) => void;
  nextMessage: CustomChatMessage | undefined;
  authToken: string;
  sessionId: string | undefined;
  onFeedback?: (messageIndex: number, feedback: 1 | -1) => void;
}) {
  const { message } = props;

  if (props.message.type === "user") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        {props.message.content.map((msg, index) => {
          if (msg.type === "text") {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: EXPECTED
              <div className="flex justify-end" key={index}>
                <div className="max-w-[80%] overflow-auto rounded-xl border bg-card px-4 py-2">
                  <StyledMarkdownRenderer
                    isMessagePending={props.isMessagePending}
                    text={msg.text}
                    type="user"
                  />
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {/* Left Icon */}
      <div className="-translate-y-[2px] relative shrink-0">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            message.type === "assistant" && "border bg-card",
            message.type === "error" && "border",
            message.type === "presence" && "border bg-card",
          )}
        >
          {(message.type === "presence" || message.type === "assistant") && (
            <MessageCircleIcon className="size-5 text-muted-foreground" />
          )}

          {message.type === "error" && (
            <AlertCircleIcon className="size-5 text-destructive-text" />
          )}
        </div>
      </div>

      {/* Right Message */}
      <div className="min-w-0 grow">
        <ScrollShadow className="rounded-lg">
          <RenderResponse
            authToken={props.authToken}
            client={props.client}
            isMessagePending={props.isMessagePending}
            message={message}
            nextMessage={props.nextMessage}
            sendMessage={props.sendMessage}
            sessionId={props.sessionId}
          />
        </ScrollShadow>

        {/* Custom Feedback Buttons */}
        {message.type === "assistant" &&
          !props.isMessagePending &&
          props.onFeedback && (
            <CustomFeedbackButtons
              className="mt-4"
              message={message}
              messageIndex={props.messageIndex}
              onFeedback={props.onFeedback}
            />
          )}
      </div>
    </div>
  );
}

function CustomFeedbackButtons(props: {
  message: CustomChatMessage & { type: "assistant" };
  messageIndex: number;
  onFeedback: (messageIndex: number, feedback: 1 | -1) => void;
  className?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (feedback: 1 | -1) => {
    if (isSubmitting || props.message.feedback) return;

    setIsSubmitting(true);
    try {
      await props.onFeedback(props.messageIndex, feedback);
    } catch (_e) {
      // Handle error silently
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show buttons if feedback already given
  if (props.message.feedback) {
    return null;
  }

  return (
    <div className={cn("flex gap-2", props.className)}>
      <button
        aria-label="Thumbs up"
        className="text-muted-foreground transition-colors hover:text-green-500 disabled:opacity-50"
        disabled={isSubmitting}
        onClick={() => handleFeedback(1)}
        type="button"
      >
        <ThumbsUpIcon className="size-5" />
      </button>
      <button
        aria-label="Thumbs down"
        className="text-muted-foreground transition-colors hover:text-red-500 disabled:opacity-50"
        disabled={isSubmitting}
        onClick={() => handleFeedback(-1)}
        type="button"
      >
        <ThumbsDownIcon className="size-5" />
      </button>
    </div>
  );
}

function RenderResponse(props: {
  message: CustomChatMessage;
  isMessagePending: boolean;
  client: ThirdwebClient;
  sendMessage: (message: UserMessage) => void;
  nextMessage: CustomChatMessage | undefined;
  sessionId: string | undefined;
  authToken: string;
}) {
  const { message, isMessagePending } = props;

  switch (message.type) {
    case "assistant":
      return (
        <StyledMarkdownRenderer
          isMessagePending={isMessagePending}
          text={message.text}
          type="assistant"
        />
      );

    case "presence":
      return <Reasoning isPending={isMessagePending} texts={message.texts} />;

    case "error":
      return (
        <div className="rounded-xl border bg-card px-4 py-2 text-destructive-text leading-normal">
          {message.text}
        </div>
      );

    case "user": {
      return null;
    }

    default: {
      // This ensures TypeScript will catch if we miss a case
      const _exhaustive: never = message;
      console.error("Unhandled message type:", _exhaustive);
      return null;
    }
  }
}

function StyledMarkdownRenderer(props: {
  text: string;
  isMessagePending: boolean;
  type: "assistant" | "user";
}) {
  return (
    <MarkdownRenderer
      className="text-foreground [&>*:first-child]:mt-0 [&>*:first-child]:border-none [&>*:first-child]:pb-0 [&>*:last-child]:mb-0"
      code={{
        className: "bg-transparent",
        ignoreFormattingErrors: true,
      }}
      inlineCode={{ className: "border-none" }}
      li={{ className: "text-foreground" }}
      markdownText={props.text}
      p={{
        className:
          props.type === "assistant"
            ? "text-foreground"
            : "text-foreground leading-normal",
      }}
      skipHtml
    />
  );
}
