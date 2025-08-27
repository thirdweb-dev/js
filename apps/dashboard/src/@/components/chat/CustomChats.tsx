import {
  AlertCircleIcon,
  ArrowRightIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Team } from "@/api/team/get-team";
import { MarkdownRenderer } from "@/components/blocks/markdown-renderer";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollShadow } from "@/components/ui/ScrollShadow";
import { cn } from "@/lib/utils";
import { ThirdwebMiniLogo } from "../../../app/(app)/components/ThirdwebMiniLogo";
import { SupportTicketForm } from "../../../app/(app)/team/[team_slug]/(team)/~/support/_components/SupportTicketForm";
import { Button } from "../ui/button";
import { TextShimmer } from "../ui/text-shimmer";

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
  onFeedback?: (messageIndex: number, feedback: 1 | -1) => Promise<void>;
  showSupportForm: boolean;
  setShowSupportForm: (v: boolean) => void;
  productLabel: string;
  setProductLabel: (v: string) => void;
  team: Team;
  addSuccessMessage?: (message: string) => void;
}) {
  const { messages, setEnableAutoScroll, enableAutoScroll } = props;
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [supportTicketCreated, setSupportTicketCreated] = useState(false);

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

  const [showSupportFormDialog, setShowSupportFormDialog] = useState(false);

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
                  {/* Support Case Button/Form in last assistant message */}
                  {message.type === "assistant" &&
                    index === props.messages.length - 1 && (
                      <>
                        {/* Only show button/form if ticket not created */}
                        {!supportTicketCreated && (
                          <div className="mt-3 pl-12">
                            <Dialog
                              open={showSupportFormDialog}
                              onOpenChange={setShowSupportFormDialog}
                            >
                              <Button
                                onClick={() => setShowSupportFormDialog(true)}
                                size="sm"
                                variant="outline"
                                className="rounded-full bg-card"
                              >
                                Create Support Case
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                              </Button>

                              <DialogContent className="p-0 bg-card">
                                <DynamicHeight>
                                  <DialogHeader className="p-4 lg:p-6 border-b border-dashed space-y-1">
                                    <DialogTitle className="text-xl font-semibold text-foreground tracking-tight">
                                      Create Support Case
                                    </DialogTitle>
                                    <p className="text-muted-foreground text-sm">
                                      Let's create a detailed support case for
                                      our technical team.
                                    </p>
                                  </DialogHeader>
                                  <SupportTicketForm
                                    team={props.team}
                                    productLabel={props.productLabel}
                                    setProductLabel={props.setProductLabel}
                                    conversationId={props.sessionId}
                                    closeForm={() => {
                                      setShowSupportFormDialog(false);
                                    }}
                                    onSuccess={() => {
                                      props.setShowSupportForm(false);
                                      props.setProductLabel("");
                                      setSupportTicketCreated(true);
                                      // Add success message as a regular assistant message
                                      if (props.addSuccessMessage) {
                                        const supportPortalUrl = `/team/${props.team.slug}/~/support`;
                                        props.addSuccessMessage(
                                          `Your support ticket has been created! Our team will get back to you soon. You can also visit the [support portal](${supportPortalUrl}) to track your case.`,
                                        );
                                      }
                                    }}
                                  />
                                </DynamicHeight>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </>
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
  message: CustomChatMessage;
  messageIndex: number;
  isMessagePending: boolean;
  client: ThirdwebClient;
  sendMessage: (message: UserMessage) => void;
  nextMessage: CustomChatMessage | undefined;
  authToken: string;
  sessionId: string | undefined;
  onFeedback?: (messageIndex: number, feedback: 1 | -1) => Promise<void>;
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
            message.type === "assistant" && "border bg-inverted",
            message.type === "error" && "border",
            message.type === "presence" && "border bg-inverted",
          )}
        >
          {(message.type === "presence" || message.type === "assistant") && (
            <ThirdwebMiniLogo
              className="size-4 text-inverted-foreground"
              isMonoChrome
            />
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
  onFeedback: (messageIndex: number, feedback: 1 | -1) => Promise<void>;
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
    }

    setIsSubmitting(false);
  };

  // Don't show buttons if feedback already given
  if (props.message.feedback) {
    return null;
  }

  return (
    <div className={cn("flex gap-1.5", props.className)}>
      <Button
        aria-label="Upvote"
        variant="outline"
        disabled={isSubmitting}
        onClick={() => handleFeedback(1)}
        type="button"
        className="size-8 p-0 rounded-lg bg-card"
      >
        <ThumbsUpIcon className="size-3.5" />
      </Button>
      <Button
        aria-label="Downvote"
        variant="outline"
        disabled={isSubmitting}
        onClick={() => handleFeedback(-1)}
        className="size-8 p-0 rounded-lg bg-card"
      >
        <ThumbsDownIcon className="size-3.5" />
      </Button>
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
      return (
        <div className="h-8 flex items-center">
          <TextShimmer text="Reasoning..." />
        </div>
      );

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
      className="text-sm text-foreground [&>*:first-child]:mt-0 [&>*:first-child]:border-none [&>*:first-child]:pb-0 [&>*:last-child]:mb-0 leading-relaxed"
      code={{
        ignoreFormattingErrors: true,
      }}
      inlineCode={{ className: "border-none" }}
      li={{ className: "text-foreground leading-relaxed" }}
      markdownText={props.text}
      p={{
        className: "text-foreground leading-relaxed",
      }}
      skipHtml
    />
  );
}
