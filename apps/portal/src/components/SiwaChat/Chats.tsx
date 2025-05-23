import { NebulaIcon } from "@/icons";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { ScrollShadow } from "../others/ScrollShadow/ScrollShadow";
import type { NebulaUserMessageContent } from "./types";

export type ChatMessage =
  | {
      type: "user";
      content: NebulaUserMessageContent;
    }
  | {
      texts: string[];
      type: "presence";
    }
  | {
      request_id: string | undefined;
      text: string;
      type: "assistant";
    };

export function Chats(props: {
  messages: Array<ChatMessage>;
  className?: string;
  setEnableAutoScroll: (enable: boolean) => void;
  enableAutoScroll: boolean;
  useSmallText?: boolean;
}) {
  const { messages, setEnableAutoScroll, enableAutoScroll } = props;
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableAutoScroll || messages.length === 0) {
      return;
    }
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, enableAutoScroll]);

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

    return () => {
      chatScrollContainer.removeEventListener("mousedown", disableScroll);
      chatScrollContainer.removeEventListener("wheel", disableScroll);
    };
  }, [setEnableAutoScroll, enableAutoScroll]);

  return (
    <div
      className="relative flex max-h-full flex-1 flex-col overflow-hidden rounded-lg"
      ref={chatContainerRef}
    >
      <ScrollShadow
        className="min-h-0 flex-1"
        scrollableClassName="max-h-full overscroll-contain"
        shadowColor="hsl(var(--background))"
        shadowClassName="z-[1]"
      >
        <div className="container max-w-[800px]">
          <div className={cn("flex flex-col gap-5 py-4", props.className)}>
            {props.messages.map((message, index) => {
              const shouldHideMessage =
                message.type === "user" &&
                message.content.every((msg) => msg.type === "transaction");
              if (shouldHideMessage) {
                return null;
              }

              // Create a unique key based on message content and position
              const messageKey =
                message.type === "user"
                  ? `user-${index}-${message.content[0]?.type === "text" ? message.content[0].text.slice(0, 50) : "unknown"}`
                  : message.type === "assistant"
                    ? `assistant-${index}-${message.text?.slice(0, 50) || "empty"}`
                    : `${message.type}-${index}`;

              return (
                <div
                  className={cn(
                    "fade-in-0 min-w-0 animate-in pt-1 text-sm duration-300 lg:text-base",
                    props.useSmallText && "lg:text-sm",
                  )}
                  key={messageKey}
                >
                  <RenderMessage message={message} />
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
}) {
  if (props.message.type === "user") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        {props.message.content.map((msg, index) => {
          if (msg.type === "text") {
            // Create unique key based on content type and text
            const contentKey = `${msg.type}-${msg.text.slice(0, 100)}-${index}`;
            return (
              <div className="flex justify-end" key={contentKey}>
                <div className="max-w-[80%] overflow-auto rounded-xl border bg-card px-4 py-2">
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
  if (props.message.type === "assistant") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <div className="-translate-y-[2px] relative shrink-0">
            <div className="flex size-9 items-center justify-center rounded-full border bg-card">
              <NebulaIcon className="size-5 text-muted-foreground" />
            </div>
          </div>
          <div className="min-w-0 grow">
            <ScrollShadow className="rounded-lg">
              <span>{props.message.text}</span>
            </ScrollShadow>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
