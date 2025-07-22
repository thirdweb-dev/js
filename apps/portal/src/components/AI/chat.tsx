"use client";

import {
  ArrowUpIcon,
  MessageCircleIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
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
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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

// Empty State Component
function ChatEmptyState({
  onPromptClick,
}: {
  onPromptClick: (prompt: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-16 text-center">
      <MessageCircleIcon className="size-16" />

      <h2 className="font-semibold text-3xl text-foreground">
        How can I help you <br />
        build onchain today?
      </h2>

      <div className="flex w-full max-w-md flex-col items-center justify-center space-y-3">
        {predefinedPrompts.map((prompt) => (
          <Button
            className="h-auto w-full justify-start whitespace-normal p-4 text-left"
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
  const lastMessageRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (lastMessageRef.current && messages.length > 0) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages.length]);

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

  const handleFeedback = async (messageId: string, feedback: 1 | -1) => {
    if (!conversationId) return; // Don't send feedback if no conversation

    try {
      await sendFeedback(conversationId, feedback);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, feedback } : msg,
        ),
      );
    } catch (_e) {
      // Optionally handle error
    }
  };

  return (
    <div className="mx-auto flex size-full flex-col overflow-hidden lg:min-w-[800px] lg:max-w-5xl">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <ChatEmptyState onPromptClick={handleSendMessage} />
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
                key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : null}
              >
                <div
                  className={cn(
                    "max-w-[100%] rounded-lg p-3",
                    message.role === "user"
                      ? "bg-muted text-muted-foreground"
                      : "bg-transparent",
                  )}
                >
                  {message.role === "assistant" && message.isLoading ? (
                    <LoadingDots />
                  ) : (
                    <>
                      <StyledMarkdownRenderer
                        isMessagePending={false}
                        text={message.content}
                        type={message.role}
                      />
                      {message.role === "assistant" && !message.isLoading && (
                        <div className="mt-2 flex gap-2">
                          {!message.feedback && (
                            <>
                              <button
                                aria-label="Thumbs up"
                                className="text-muted-foreground transition-colors hover:text-green-500"
                                onClick={() => handleFeedback(message.id, 1)}
                                type="button"
                              >
                                <ThumbsUpIcon className="size-5" />
                              </button>
                              <button
                                aria-label="Thumbs down"
                                className="text-muted-foreground transition-colors hover:text-red-500"
                                onClick={() => handleFeedback(message.id, -1)}
                                type="button"
                              >
                                <ThumbsDownIcon className="size-5" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="relative rounded-lg bg-muted text-muted-foreground">
          <AutoResizeTextarea
            className="min-h-[100px] resize-none bg-transparent pt-4 pr-20 pl-4"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI Assistant..."
            rows={2}
            value={input}
          />
          <Button
            className="-translate-y-1/2 absolute top-1/2 right-2"
            disabled={!input.trim()}
            onClick={() => {
              const currentInput = input;
              setInput("");
              handleSendMessage(currentInput);
            }}
            type="submit"
            variant={"primary"}
          >
            <ArrowUpIcon />
          </Button>
        </div>
      </div>
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
