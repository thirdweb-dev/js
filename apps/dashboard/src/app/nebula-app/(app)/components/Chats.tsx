import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { MarkdownRenderer } from "components/contract-components/published-contract/markdown-renderer";
import {
  AlertCircleIcon,
  CheckIcon,
  CopyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import type { NebulaSwapData } from "../api/chat";
import { submitFeedback } from "../api/feedback";
import { NebulaIcon } from "../icons/NebulaIcon";
import { ExecuteTransactionCard } from "./ExecuteTransactionCard";
import { Reasoning } from "./Reasoning/Reasoning";
import { ApproveTransactionCard, SwapTransactionCard } from "./Swap/SwapCards";

export type NebulaTxData = {
  chainId: number;
  data: `0x${string}`;
  to: string;
  value?: string;
};

export type ChatMessage =
  | {
      text: string;
      type: "user" | "error";
    }
  | {
      texts: string[];
      type: "presence";
    }
  | {
      // assistant type message loaded from history doesn't have request_id
      request_id: string | undefined;
      text: string;
      type: "assistant";
    }
  | {
      type: "action";
      subtype: "sign_transaction";
      data: NebulaTxData;
    }
  | {
      type: "action";
      subtype: "sign_swap";
      data: NebulaSwapData;
    };

export function Chats(props: {
  messages: Array<ChatMessage>;
  isChatStreaming: boolean;
  authToken: string;
  sessionId: string | undefined;
  className?: string;
  client: ThirdwebClient;
  setEnableAutoScroll: (enable: boolean) => void;
  enableAutoScroll: boolean;
  useSmallText?: boolean;
  sendMessage: (message: string) => void;
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
        shadowColor="hsl(var(--background))"
        shadowClassName="z-[1]"
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
                  {message.type === "user" ? (
                    <div className="mt-6 flex justify-end">
                      <div className="max-w-[80%] overflow-auto rounded-xl border bg-card px-4 py-2">
                        <StyledMarkdownRenderer
                          text={message.text}
                          isMessagePending={isMessagePending}
                          type="user"
                        />
                      </div>
                    </div>
                  ) : (
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
                          {message.type === "presence" && (
                            <NebulaIcon className="size-5 text-muted-foreground" />
                          )}

                          {message.type === "assistant" && (
                            <NebulaIcon className="size-5 text-muted-foreground" />
                          )}

                          {message.type === "error" && (
                            <AlertCircleIcon className="size-5 text-destructive-text" />
                          )}
                        </div>
                      </div>

                      {/* Right Message */}
                      <div className="min-w-0 grow">
                        <ScrollShadow className="rounded-lg">
                          <RenderMessage
                            message={message}
                            isMessagePending={isMessagePending}
                            client={props.client}
                            sendMessage={props.sendMessage}
                          />
                        </ScrollShadow>

                        {message.type === "assistant" &&
                          !isMessagePending &&
                          props.sessionId &&
                          message.request_id && (
                            <MessageActions
                              messageText={message.text}
                              authToken={props.authToken}
                              requestId={message.request_id}
                              sessionId={props.sessionId}
                              className="mt-4"
                            />
                          )}
                      </div>
                    </div>
                  )}
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
  message: ChatMessage;
  isMessagePending: boolean;
  client: ThirdwebClient;
  sendMessage: (message: string) => void;
}) {
  const { message, isMessagePending, client, sendMessage } = props;

  switch (message.type) {
    case "assistant":
      return (
        <StyledMarkdownRenderer
          text={message.text}
          isMessagePending={isMessagePending}
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

    case "action": {
      if (message.subtype === "sign_transaction") {
        return (
          <ExecuteTransactionCard
            txData={message.data}
            client={client}
            onTxSettled={(txHash) => {
              sendMessage(getTransactionSettledPrompt(txHash));
            }}
          />
        );
      }

      if (message.subtype === "sign_swap") {
        if (message.data.action === "approval") {
          return (
            <ApproveTransactionCard swapData={message.data} client={client} />
          );
        }

        return (
          <SwapTransactionCard
            swapData={message.data}
            client={client}
            onTxSettled={() => {
              // no op
            }}
          />
        );
      }
    }
  }

  return null;
}

function getTransactionSettledPrompt(txHash: string) {
  return `\
I've executed the following transaction successfully with hash: ${txHash}.

If our conversation calls for it, continue on to the next transaction or suggest next steps`;
}

function MessageActions(props: {
  authToken: string;
  requestId: string;
  sessionId: string;
  messageText: string;
  className?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  function sendRating(rating: "good" | "bad") {
    return submitFeedback({
      authToken: props.authToken,
      rating,
      requestId: props.requestId,
      sessionId: props.sessionId,
    });
  }
  const sendPositiveRating = useMutation({
    mutationFn: () => sendRating("good"),
    onSuccess() {
      toast.info("Thanks for the feedback!");
    },
    onError() {
      toast.error("Failed to send feedback");
    },
  });

  const sendBadRating = useMutation({
    mutationFn: () => sendRating("bad"),
    onSuccess() {
      toast.info("Thanks for the feedback!", {
        position: "top-right",
      });
    },
    onError() {
      toast.error("Failed to send feedback", {
        position: "top-right",
      });
    },
  });

  return (
    <div
      className={cn("flex items-center gap-2 text-foreground", props.className)}
    >
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-2 rounded-lg text-sm"
        onClick={() => {
          navigator.clipboard.writeText(props.messageText);
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1000);
        }}
      >
        {isCopied ? (
          <CheckIcon className="size-3.5 text-green-500" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
        Copy
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="size-8 rounded-lg p-0"
        onClick={() => {
          sendPositiveRating.mutate();
        }}
      >
        {sendPositiveRating.isPending ? (
          <Spinner className="size-4" />
        ) : (
          <ThumbsUpIcon className="size-4" />
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="size-8 rounded-lg p-0"
        onClick={() => {
          sendBadRating.mutate();
        }}
      >
        {sendBadRating.isPending ? (
          <Spinner className="size-4" />
        ) : (
          <ThumbsDownIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

function StyledMarkdownRenderer(props: {
  text: string;
  isMessagePending: boolean;
  type: "assistant" | "user";
}) {
  return (
    <MarkdownRenderer
      skipHtml
      markdownText={props.text}
      className="text-foreground [&>*:first-child]:mt-0 [&>*:first-child]:border-none [&>*:first-child]:pb-0 [&>*:last-child]:mb-0"
      code={{
        ignoreFormattingErrors: true,
        className: "bg-transparent",
      }}
      p={{
        className:
          props.type === "assistant"
            ? "text-foreground"
            : "text-foreground leading-normal",
      }}
      li={{ className: "text-foreground" }}
      inlineCode={{ className: "border-none" }}
    />
  );
}
