"use client";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import {
  ArrowUpIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UserIcon,
} from "lucide-react";
import { usePostHog } from "posthog-js/react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Toaster } from "@/components/ui/sonner";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { ThirdwebIcon } from "@/icons/thirdweb";
import { Spinner } from "../ui/Spinner/Spinner";
import { getChatResponse, sendFeedback } from "./api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
  feedback?: 1 | -1;
}

const predefinedPrompts = [
  "How do I connect an in-app wallet with google in react?",
  "How do I deploy a DropERC1155 contract in typescript?",
  "How do I send a transaction in Unity?",
];

const queryClient = new QueryClient();

// Empty State Component
function ChatEmptyState({
  onPromptClick,
}: {
  onPromptClick: (prompt: string) => void;
}) {
  return (
    <div className="flex grow flex-col items-center justify-center">
      {/* tw logo */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-full border p-1 bg-muted/20">
          <div className="rounded-full border p-2 bg-inverted">
            <ThirdwebIcon
              isMonoChrome
              className="size-7 text-inverted-foreground"
            />
          </div>
        </div>
      </div>

      {/* title */}
      <h1 className="px-4 text-center font-semibold text-3xl tracking-tight md:text-4xl mb-8">
        How can I help you <br className="max-sm:hidden" />
        today?
      </h1>

      {/* prompts */}
      <div className="flex w-full max-w-md flex-col items-center justify-center space-y-3">
        {predefinedPrompts.map((prompt) => (
          <Button
            className="rounded-full text-xs sm:text-sm truncate bg-card w-fit h-auto py-1.5 whitespace-pre-wrap font-normal text-muted-foreground"
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            variant="outline"
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const posthog = usePostHog();
  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined,
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      posthog?.capture("siwa.send-message", {
        message: content,
        sessionId: conversationId,
      });

      const userMessage: Message = {
        content,
        id: Date.now().toString(),
        role: "user",
      };

      const loadingMessageId = (Date.now() + 1).toString();
      const assistantLoadingMessage: Message = {
        content: "",
        id: loadingMessageId,
        isLoading: true,
        role: "assistant",
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        assistantLoadingMessage,
      ]);

      // Input clearing is handled by the callers (handleKeyDown, button onClick)

      try {
        const response = await getChatResponse(content, conversationId);

        if (response?.conversationId) {
          setConversationId(response.conversationId);
        }

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === loadingMessageId
              ? { ...msg, content: response?.data ?? "", isLoading: false }
              : msg,
          ),
        );
      } catch (error) {
        console.error("Failed to get chat response:", error);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === loadingMessageId
              ? {
                  ...msg,
                  content: "Error: Could not load response.",
                  isLoading: false,
                }
              : msg,
          ),
        );
      }
    },
    [conversationId, posthog],
  );

  const lastMessageLength = messages[messages.length - 1]?.content.length ?? 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: need both the number of messages and the last message length to trigger the scroll
  useEffect(() => {
    if (scrollAnchorRef.current && messages.length > 0) {
      scrollAnchorRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages.length, lastMessageLength]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const currentInput = input;
      setInput("");
      handleSendMessage(currentInput);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex max-h-full flex-col grow overflow-hidden">
        <Toaster richColors />
        <div className="relative flex max-h-full flex-1 flex-col overflow-hidden px-4">
          {messages.length === 0 ? (
            <ChatEmptyState onPromptClick={handleSendMessage} />
          ) : (
            <ScrollShadow
              className="flex-1"
              scrollableClassName="max-h-full overscroll-contain"
              shadowColor="hsl(var(--background))"
              shadowClassName="z-[1]"
            >
              <div className="space-y-8 pt-6 pb-16">
                {messages.map((message) => (
                  <RenderMessage
                    conversationId={conversationId}
                    message={message}
                    key={message.id}
                  />
                ))}
              </div>
              <div ref={scrollAnchorRef} />
            </ScrollShadow>
          )}
        </div>

        <div className="relative z-stickyTop">
          <AutoResizeTextarea
            className="min-h-[120px] rounded-xl border-x-0 border-b-0 rounded-t-none bg-card focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI Assistant..."
            rows={2}
            value={input}
          />
          <Button
            className="absolute bottom-3 right-3 disabled:opacity-100 !h-auto w-auto shrink-0 gap-2 p-2"
            disabled={!input.trim()}
            onClick={() => {
              const currentInput = input;
              setInput("");
              handleSendMessage(currentInput);
            }}
            type="submit"
            size="sm"
            variant="default"
          >
            <ArrowUpIcon className="size-4" />
          </Button>
        </div>
      </div>
    </QueryClientProvider>
  );
}

const aiIcon = (
  <div className="rounded-full size-7 lg:size-9 border shrink-0 flex items-center justify-center bg-inverted">
    <ThirdwebIcon
      className="size-3 lg:size-4 text-inverted-foreground"
      isMonoChrome
    />
  </div>
);

const userIcon = (
  <div className="rounded-full size-7 lg:size-9 border bg-card shrink-0 flex items-center justify-center translate-y-1">
    <UserIcon className="size-3 lg:size-4 text-muted-foreground" />
  </div>
);

function RenderAIResponse(props: {
  conversationId: string | undefined;
  message: Message;
}) {
  const thumbsUpFeedbackMutation = useMutation({
    mutationFn: () => {
      if (!props.conversationId) {
        throw new Error("No conversation ID");
      }
      return sendFeedback(props.conversationId, 1);
    },
  });

  const thumbsDownFeedbackMutation = useMutation({
    mutationFn: () => {
      if (!props.conversationId) {
        throw new Error("No conversation ID");
      }
      return sendFeedback(props.conversationId, -1);
    },
  });

  return (
    <div className="flex items-start gap-3.5">
      {aiIcon}
      <div className="flex-1 min-w-0 overflow-hidden fade-in-0 duration-300 animate-in">
        <StyledMarkdownRenderer
          text={props.message.content}
          type="assistant"
          isMessagePending={false}
        />

        {props.conversationId && (
          <div className="mt-4 flex gap-2">
            <Button
              aria-label="Thumbs up"
              onClick={() => {
                const promise = thumbsUpFeedbackMutation.mutateAsync();
                toast.promise(promise, {
                  success: "Feedback sent",
                  error: "Failed to send feedback",
                });
              }}
              type="button"
              className="size-8 p-0 rounded-lg bg-card"
              variant="outline"
            >
              {thumbsUpFeedbackMutation.isPending ? (
                <Spinner className="size-3.5" />
              ) : (
                <ThumbsUpIcon className="size-3.5" />
              )}
            </Button>
            <Button
              aria-label="Thumbs down"
              className="size-8 p-0 rounded-lg bg-card"
              onClick={() => {
                const promise = thumbsDownFeedbackMutation.mutateAsync();
                toast.promise(promise, {
                  success: "Feedback sent",
                  error: "Failed to send feedback",
                });
              }}
              type="button"
              variant="outline"
            >
              {thumbsDownFeedbackMutation.isPending ? (
                <Spinner className="size-3.5" />
              ) : (
                <ThumbsDownIcon className="size-3.5" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function RenderMessage(props: {
  message: Message;
  conversationId: string | undefined;
}) {
  if (props.message.role === "user") {
    return (
      <div className="flex items-start gap-3.5">
        {userIcon}
        <div className="px-3.5 py-2 rounded-xl border bg-card relative fade-in-0 duration-300 animate-in">
          <StyledMarkdownRenderer
            text={props.message.content}
            type="user"
            isMessagePending={false}
          />
        </div>
      </div>
    );
  }

  if (props.message.role === "assistant" && props.message.isLoading) {
    return (
      <div className="flex items-center gap-3.5">
        {aiIcon}
        <div className="fade-in-0 duration-300 animate-in">
          <TextShimmer text="Thinking..." className="text-sm" />
        </div>
      </div>
    );
  }

  if (props.message.role === "assistant" && !props.message.isLoading) {
    return (
      <RenderAIResponse
        conversationId={props.conversationId}
        message={props.message}
      />
    );
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
        className: "bg-card",
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
