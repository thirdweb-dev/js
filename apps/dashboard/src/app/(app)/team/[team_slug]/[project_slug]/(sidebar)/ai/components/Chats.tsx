import { MarkdownRenderer } from "@workspace/ui/components/markdown-renderer";
import { ScrollShadow } from "@workspace/ui/components/scroll-shadow";
import { AlertCircleIcon, BotIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import { cn } from "@/lib/utils";
import type {
  NebulaSwapData,
  NebulaTxData,
  NebulaUserMessage,
  NebulaUserMessageContent,
} from "../api/types";
import { ExecuteTransactionCard } from "./ExecuteTransactionCard";
import { MessageActions } from "./MessageActions";
import { NebulaImage } from "./NebulaImage";
import { Reasoning } from "./Reasoning/Reasoning";
import { ApproveTransactionCard, SwapTransactionCard } from "./Swap/SwapCards";

export type ChatMessage =
  | {
      type: "user";
      content: NebulaUserMessageContent;
    }
  | {
      text: string;
      type: "error";
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
  project: Project;
  messages: Array<ChatMessage>;
  isChatStreaming: boolean;
  authToken: string;
  sessionId: string | undefined;
  className?: string;
  client: ThirdwebClient;
  setEnableAutoScroll: (enable: boolean) => void;
  enableAutoScroll: boolean;
  useSmallText?: boolean;
  sendMessage: (message: NebulaUserMessage) => void;
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

              const shouldHideMessage =
                message.type === "user" &&
                message.content.every((msg) => msg.type === "transaction");

              if (shouldHideMessage) {
                return null;
              }

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
                    project={props.project}
                    authToken={props.authToken}
                    client={props.client}
                    isMessagePending={isMessagePending}
                    message={message}
                    nextMessage={props.messages[index + 1]}
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
  message: ChatMessage;
  isMessagePending: boolean;
  client: ThirdwebClient;
  sendMessage: (message: NebulaUserMessage) => void;
  nextMessage: ChatMessage | undefined;
  authToken: string;
  sessionId: string | undefined;
  project: Project;
}) {
  const { message } = props;

  if (props.message.type === "user") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        {props.message.content.map((msg, index) => {
          if (msg.type === "text") {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: TODO
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

          if (msg.type === "image") {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: TODO
              <div className="flex justify-end" key={index}>
                <NebulaImage
                  client={props.client}
                  project={props.project}
                  type="submitted"
                  url={
                    typeof msg.b64 === "string"
                      ? msg.b64.startsWith("data:image")
                        ? msg.b64
                        : `data:image/png;base64,${msg.b64}`
                      : (msg.image_url ?? "")
                  }
                />
              </div>
            );
          }

          if (msg.type === "transaction") {
            return null;
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
          {message.type === "presence" && (
            <BotIcon className="size-5 text-muted-foreground" />
          )}

          {message.type === "assistant" && (
            <BotIcon className="size-5 text-muted-foreground" />
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
            project={props.project}
            authToken={props.authToken}
            client={props.client}
            isMessagePending={props.isMessagePending}
            message={message}
            nextMessage={props.nextMessage}
            sendMessage={props.sendMessage}
            sessionId={props.sessionId}
          />
        </ScrollShadow>

        {/* message feedback */}
        {message.type === "assistant" &&
          !props.isMessagePending &&
          props.sessionId &&
          message.request_id && (
            <MessageActions
              project={props.project}
              className="mt-4"
              messageText={message.text}
              requestId={message.request_id}
              sessionId={props.sessionId}
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
  sendMessage: (message: NebulaUserMessage) => void;
  nextMessage: ChatMessage | undefined;
  sessionId: string | undefined;
  authToken: string;
  project: Project;
}) {
  const { message, isMessagePending, client, sendMessage, nextMessage } = props;

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
    case "image": {
      return (
        <NebulaImage
          project={props.project}
          client={client}
          height={message.data.height}
          requestId={message.request_id}
          sessionId={props.sessionId}
          type="response"
          url={message.data.url}
          width={message.data.width}
        />
      );
    }

    case "action": {
      if (message.subtype === "sign_transaction") {
        return (
          <ExecuteTransactionCard
            client={client}
            onTxSettled={(txHash) => {
              // do not send automatic prompt if there is another transaction after this one
              if (nextMessage?.type === "action") {
                return;
              }

              sendMessage({
                content: [
                  {
                    chain_id: message.data.chain_id,
                    transaction_hash: txHash,
                    type: "transaction",
                  },
                ],
                role: "user",
              });
            }}
            txData={message.data}
          />
        );
      }

      if (message.subtype === "sign_swap") {
        if (message.data.action === "approval") {
          return (
            <ApproveTransactionCard client={client} swapData={message.data} />
          );
        }

        return (
          <SwapTransactionCard
            client={client}
            onTxSettled={(txHash) => {
              // do not send automatic prompt if there is another transaction after this one
              if (nextMessage?.type === "action") {
                return;
              }

              sendMessage({
                content: [
                  {
                    chain_id: message.data.transaction.chain_id,
                    transaction_hash: txHash,
                    type: "transaction",
                  },
                ],
                role: "user",
              });
            }}
            swapData={message.data}
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

function StyledMarkdownRenderer(props: {
  text: string;
  isMessagePending: boolean;
  type: "assistant" | "user";
}) {
  return (
    <MarkdownRenderer
      className="[&>*:first-child]:mt-0 [&>*:first-child]:border-none [&>*:first-child]:pb-0 [&>*:last-child]:mb-0"
      code={{
        className: "bg-transparent",
        ignoreFormattingErrors: true,
      }}
      inlineCode={{ className: "border-none" }}
      markdownText={props.text}
      p={{
        className: props.type === "assistant" ? "" : "leading-normal",
      }}
      skipHtml
    />
  );
}
