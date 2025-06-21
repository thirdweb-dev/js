"use client";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { NebulaIcon } from "../../app/(app)/(dashboard)/(chain)/components/server/icons/NebulaIcon";
import { ChatBar } from "./ChatBar";
import type { UserMessage, UserMessageContent } from "./CustomChats";
import { type CustomChatMessage, CustomChats } from "./CustomChats";
import type { ExamplePrompt, NebulaContext } from "./types";

export default function CustomChatContent(props: {
  authToken: string | undefined;
  teamId: string | undefined;
  clientId: string | undefined;
  client: ThirdwebClient;
  examplePrompts: ExamplePrompt[];
  networks: NebulaContext["networks"];
  requireLogin?: boolean;
}) {
  if (props.requireLogin !== false && !props.authToken) {
    return <LoggedOutStateChatContent />;
  }

  return (
    <CustomChatContentLoggedIn
      authToken={props.authToken || ""}
      client={props.client}
      clientId={props.clientId}
      examplePrompts={props.examplePrompts}
      teamId={props.teamId}
    />
  );
}

function CustomChatContentLoggedIn(props: {
  authToken: string;
  teamId: string | undefined;
  clientId: string | undefined;
  client: ThirdwebClient;
  examplePrompts: ExamplePrompt[];
}) {
  const [userHasSubmittedMessage, setUserHasSubmittedMessage] = useState(false);
  const [messages, setMessages] = useState<Array<CustomChatMessage>>([]);
  // sessionId is initially undefined, will be set to conversationId from API after first response
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [chatAbortController, setChatAbortController] = useState<
    AbortController | undefined
  >();

  const [isChatStreaming, setIsChatStreaming] = useState(false);
  const [enableAutoScroll, setEnableAutoScroll] = useState(false);
  const connectionStatus = useActiveWalletConnectionStatus();

  const handleSendMessage = useCallback(
    async (userMessage: UserMessage) => {
      const abortController = new AbortController();
      setUserHasSubmittedMessage(true);
      setIsChatStreaming(true);
      setEnableAutoScroll(true);

      setMessages((prev) => [
        ...prev,
        {
          content: userMessage.content as UserMessageContent[],
          type: "user",
        },
        // instant loading indicator feedback to user
        {
          texts: [],
          type: "presence",
        },
      ]);

      // if this is first message, set the message prefix
      // deep clone `userMessage` to avoid mutating the original message, its a pretty small object so JSON.parse is fine
      const messageToSend = JSON.parse(
        JSON.stringify(userMessage),
      ) as UserMessage;

      try {
        setChatAbortController(abortController);
        // --- Custom API call ---
        const payload = {
          conversationId: sessionId,
          message:
            messageToSend.content.find((x) => x.type === "text")?.text ?? "",
          source: "dashboard-support",
        };
        const apiUrl = process.env.NEXT_PUBLIC_SIWA_URL;
        const response = await fetch(`${apiUrl}/v1/chat`, {
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${props.authToken}`,
            "Content-Type": "application/json",
            ...(props.teamId ? { "x-team-id": props.teamId } : {}),
            ...(props.clientId ? { "x-client-id": props.clientId } : {}),
          },
          method: "POST",
          signal: abortController.signal,
        });
        const data = await response.json();
        // If the response contains a conversationId, set it as the sessionId for future messages
        if (data.conversationId && data.conversationId !== sessionId) {
          setSessionId(data.conversationId);
        }
        setMessages((prev) => [
          ...prev.slice(0, -1), // remove presence indicator
          {
            request_id: undefined,
            text: data.data,
            type: "assistant",
          },
        ]);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            request_id: undefined,
            text: `Sorry, something went wrong. ${error instanceof Error ? error.message : "Unknown error"}`,
            type: "assistant",
          },
        ]);
      } finally {
        setIsChatStreaming(false);
        setEnableAutoScroll(false);
      }
    },
    [props.authToken, props.clientId, props.teamId, sessionId],
  );

  const handleFeedback = useCallback(
    async (messageIndex: number, feedback: 1 | -1) => {
      if (!sessionId) {
        console.error("Cannot submit feedback: missing session ID");
        return;
      }

      // Validate message exists and is of correct type
      const message = messages[messageIndex];
      if (!message || message.type !== "assistant") {
        console.error("Invalid message for feedback:", messageIndex);
        return;
      }

      // Prevent duplicate feedback
      if (message.feedback) {
        console.warn("Feedback already submitted for this message");
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_SIWA_URL;
        const response = await fetch(`${apiUrl}/v1/chat/feedback`, {
          body: JSON.stringify({
            conversationId: sessionId,
            feedbackRating: feedback,
          }),
          headers: {
            Authorization: `Bearer ${props.authToken}`,
            "Content-Type": "application/json",
            ...(props.teamId ? { "x-team-id": props.teamId } : {}),
          },
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Update the message with feedback
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === messageIndex && msg.type === "assistant"
              ? { ...msg, feedback }
              : msg,
          ),
        );
      } catch (error) {
        console.error("Failed to send feedback:", error);
        // Optionally show user-facing error notification
        // Consider implementing retry logic here
      }
    },
    [sessionId, props.authToken, props.teamId, messages],
  );

  const showEmptyState = !userHasSubmittedMessage && messages.length === 0;
  return (
    <div className="flex grow flex-col overflow-hidden">
      {showEmptyState ? (
        <EmptyStateChatPageContent
          examplePrompts={props.examplePrompts}
          sendMessage={handleSendMessage}
        />
      ) : (
        <CustomChats
          authToken={props.authToken}
          className="min-w-0 pb-10"
          client={props.client}
          enableAutoScroll={enableAutoScroll}
          isChatStreaming={isChatStreaming}
          messages={messages}
          onFeedback={handleFeedback}
          sendMessage={handleSendMessage}
          sessionId={sessionId}
          setEnableAutoScroll={setEnableAutoScroll}
          useSmallText
        />
      )}
      <ChatBar
        abortChatStream={() => {
          chatAbortController?.abort();
          setChatAbortController(undefined);
          setIsChatStreaming(false);
          // if last message is presence, remove it
          if (messages[messages.length - 1]?.type === "presence") {
            setMessages((prev) => prev.slice(0, -1));
          }
        }}
        className="rounded-none border-x-0 border-b-0"
        client={props.client}
        isChatStreaming={isChatStreaming}
        isConnectingWallet={connectionStatus === "connecting"}
        onLoginClick={undefined}
        placeholder={"Ask AI Assistant"}
        prefillMessage={undefined}
        sendMessage={(siwaUserMessage) => {
          const userMessage: UserMessage = {
            content: siwaUserMessage.content
              .filter((c) => c.type === "text")
              .map((c) => ({ text: c.text, type: "text" })),
            type: "user",
          };
          handleSendMessage(userMessage);
        }}
      />
    </div>
  );
}

function LoggedOutStateChatContent() {
  const pathname = usePathname();
  return (
    <div className="flex grow flex-col items-center justify-center p-4">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full border p-1">
          <div className="rounded-full border bg-card p-2">
            <NebulaIcon className="size-7 text-muted-foreground" />
          </div>
        </div>
      </div>

      <h1 className="px-4 text-center font-semibold text-3xl tracking-tight md:text-4xl">
        How can I help you <br className="max-sm:hidden" />
        today?
      </h1>

      <div className="h-3" />
      <p className="text-base text-muted-foreground">
        Sign in to use AI Assistant
      </p>
      <div className="h-5" />

      <Button asChild>
        <Link
          className="w-full max-w-96 gap-2"
          href={`/login?next=${encodeURIComponent(pathname)}`}
        >
          Sign in
          <ArrowRightIcon className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

function EmptyStateChatPageContent(props: {
  sendMessage: (message: UserMessage) => void;
  examplePrompts: { title: string; message: string }[];
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-auto p-4 ">
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
      <div className="flex max-w-lg flex-col flex-wrap justify-center gap-2.5">
        {props.examplePrompts.map((prompt) => (
          <Button
            disabled={false}
            key={prompt.title}
            onClick={() =>
              props.sendMessage({
                content: [
                  {
                    text: prompt.message,
                    type: "text",
                  },
                ],
                type: "user",
              })
            }
            size="sm"
            variant="outline"
          >
            {prompt.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
