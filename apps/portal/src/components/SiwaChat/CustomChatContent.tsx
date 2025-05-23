"use client";
import { NebulaIcon } from "@/icons";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { ChatBar } from "./ChatBar";
import { Chats } from "./Chats";
import type { ChatMessage } from "./Chats";
import type { ExamplePrompt } from "./examplePrompts";
import type { NebulaUserMessage } from "./types";

export default function CustomChatContent(props: {
  examplePrompts: ExamplePrompt[];
  networks: "mainnet" | "testnet" | "all" | null;
  requireLogin?: boolean;
}) {
  // No login required for portal
  return (
    <CustomChatContentLoggedIn
      networks={props.networks}
      examplePrompts={props.examplePrompts}
    />
  );
}

function CustomChatContentLoggedIn(props: {
  examplePrompts: ExamplePrompt[];
  networks: "mainnet" | "testnet" | "all" | null;
}) {
  const [userHasSubmittedMessage, setUserHasSubmittedMessage] = useState(false);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [chatAbortController, setChatAbortController] = useState<
    AbortController | undefined
  >();
  const [isChatStreaming, setIsChatStreaming] = useState(false);
  const [enableAutoScroll, setEnableAutoScroll] = useState(false);

  const handleSendMessage = useCallback(
    async (userMessage: NebulaUserMessage) => {
      const abortController = new AbortController();
      setUserHasSubmittedMessage(true);
      setIsChatStreaming(true);
      setEnableAutoScroll(true);

      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: userMessage.content,
        },
        {
          type: "presence",
          texts: [],
        },
      ]);

      const messageToSend = {
        ...userMessage,
        content: [...userMessage.content],
      } as NebulaUserMessage;

      try {
        setChatAbortController(abortController);
        const payload = {
          message:
            messageToSend.content.find((x) => x.type === "text")?.text ?? "",
          conversationId: sessionId,
        };
        const apiUrl = process.env.NEXT_PUBLIC_SIWA_URL;
        if (!apiUrl) {
          throw new Error(
            "API URL is not configured. Please set NEXT_PUBLIC_SIWA_URL environment variable.",
          );
        }
        const response = await fetch(`${apiUrl}/v1/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: abortController.signal,
        });
        if (!response.ok) {
          const errorText = await response
            .text()
            .catch(() => "No error details available");
          throw new Error(
            `HTTP error! Status: ${response.status}. Details: ${errorText}`,
          );
        }
        const data = await response.json();
        if (!data || typeof data.data !== "string") {
          throw new Error("Invalid response format from API");
        }
        if (data.conversationId && data.conversationId !== sessionId) {
          setSessionId(data.conversationId);
        }
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            type: "assistant",
            request_id: undefined,
            text: data.data,
          },
        ]);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            type: "assistant",
            request_id: undefined,
            text: `Sorry, something went wrong. ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ]);
      } finally {
        setIsChatStreaming(false);
        setEnableAutoScroll(false);
      }
    },
    [sessionId],
  );

  const showEmptyState = !userHasSubmittedMessage && messages.length === 0;
  return (
    <div className="flex grow flex-col overflow-hidden">
      {showEmptyState ? (
        <EmptyStateChatPageContent
          sendMessage={handleSendMessage}
          examplePrompts={props.examplePrompts}
        />
      ) : (
        <Chats
          messages={messages}
          className="min-w-0 pb-10"
          enableAutoScroll={enableAutoScroll}
          setEnableAutoScroll={setEnableAutoScroll}
          useSmallText
        />
      )}
      <ChatBar
        placeholder={"Ask AI Assistant"}
        onLoginClick={undefined}
        isConnectingWallet={false}
        context={undefined}
        setContext={() => {}}
        showContextSelector={false}
        connectedWallets={[]}
        setActiveWallet={() => {}}
        abortChatStream={() => {
          chatAbortController?.abort();
          setChatAbortController(undefined);
          setIsChatStreaming(false);
          if (messages[messages.length - 1]?.type === "presence") {
            setMessages((prev) => prev.slice(0, -1));
          }
        }}
        isChatStreaming={isChatStreaming}
        prefillMessage={undefined}
        sendMessage={handleSendMessage}
        className="rounded-none border-x-0 border-b-0"
      />
    </div>
  );
}

function EmptyStateChatPageContent(props: {
  sendMessage: (message: NebulaUserMessage) => void;
  examplePrompts: ExamplePrompt[];
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-auto p-4">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full border-[1.5px] border-nebula-pink-foreground/20 bg-[hsl(var(--nebula-pink-foreground)/5%)] p-1">
          <div className="rounded-full border-[1.5px] border-nebula-pink-foreground/40 bg-[hsl(var(--nebula-pink-foreground)/5%)] p-2">
            <NebulaIcon className="size-7 text-nebula-pink-foreground" />
          </div>
        </div>
      </div>

      <h1 className="px-4 text-center font-semibold text-3xl tracking-tight md:text-4xl">
        How can I help you <br className="max-sm:hidden" />
        today?
      </h1>

      <div className="h-6" />
      <div className="flex max-w-lg flex-col justify-center gap-2.5">
        {props.examplePrompts.map((prompt) => (
          <Button
            key={prompt.title}
            variant="outline"
            size="sm"
            onClick={() =>
              props.sendMessage({
                role: "user",
                content: [
                  {
                    type: "text",
                    text: prompt.message,
                  },
                ],
              })
            }
            disabled={false}
          >
            {prompt.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
