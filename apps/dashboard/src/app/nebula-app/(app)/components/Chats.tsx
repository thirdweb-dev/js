import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "components/contract-components/published-contract/markdown-renderer";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { NebulaSwapData } from "../api/chat";
import { NebulaIcon } from "../icons/NebulaIcon";
import { ExecuteTransactionCard } from "./ExecuteTransactionCard";
import { MessageActions } from "./MessageActions";
import { NebulaImage } from "./NebulaImage";
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
      request_id: string;
      data: NebulaTxData;
    }
  | {
      type: "action";
      subtype: "sign_swap";
      request_id: string;
      data: NebulaSwapData;
    }
  | {
      type: "image";
      request_id: string;
      data: {
        width: number;
        height: number;
        url: string;
      };
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
                  <RenderMessage
                    message={message}
                    isMessagePending={isMessagePending}
                    client={props.client}
                    sendMessage={props.sendMessage}
                    nextMessage={props.messages[index + 1]}
                    authToken={props.authToken}
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
  message: ChatMessage;
  isMessagePending: boolean;
  client: ThirdwebClient;
  sendMessage: (message: string) => void;
  nextMessage: ChatMessage | undefined;
  authToken: string;
  sessionId: string | undefined;
}) {
  const { message } = props;
  if (props.message.type === "user") {
    return (
      <div className="mt-6 flex justify-end">
        <div className="max-w-[80%] overflow-auto rounded-xl border bg-card px-4 py-2">
          <StyledMarkdownRenderer
            text={props.message.text}
            isMessagePending={props.isMessagePending}
            type="user"
          />
        </div>
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
          <RenderResponse
            message={message}
            isMessagePending={props.isMessagePending}
            client={props.client}
            sendMessage={props.sendMessage}
            nextMessage={props.nextMessage}
            sessionId={props.sessionId}
            authToken={props.authToken}
          />
        </ScrollShadow>

        {/* message feedback */}
        {message.type === "assistant" &&
          !props.isMessagePending &&
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
  );
}

function RenderResponse(props: {
  message: ChatMessage;
  isMessagePending: boolean;
  client: ThirdwebClient;
  sendMessage: (message: string) => void;
  nextMessage: ChatMessage | undefined;
  sessionId: string | undefined;
  authToken: string;
}) {
  const { message, isMessagePending, client, sendMessage, nextMessage } = props;

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
    case "image": {
      return (
        <NebulaImage
          url={message.data.url}
          width={message.data.width}
          height={message.data.height}
          client={client}
          requestId={message.request_id}
          sessionId={props.sessionId}
          authToken={props.authToken}
        />
      );
    }

    case "action": {
      if (message.subtype === "sign_transaction") {
        return (
          <ExecuteTransactionCard
            txData={message.data}
            client={client}
            onTxSettled={(txHash) => {
              // do not send automatic prompt if there is another transaction after this one
              if (nextMessage?.type === "action") {
                return;
              }

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
            onTxSettled={(txHash) => {
              // do not send automatic prompt if there is another transaction after this one
              if (nextMessage?.type === "action") {
                return;
              }

              sendMessage(getTransactionSettledPrompt(txHash));
            }}
          />
        );
      }

      return null;
    }

    case "user": {
      return null;
    }
  }

  return null;
}

function getTransactionSettledPrompt(txHash: string) {
  return `\
I've executed the following transaction successfully with hash: ${txHash}.

If our conversation calls for it, continue on to the next transaction or suggest next steps`;
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
