"use client";
import { Button } from "@/components/ui/button";
import { useTrack } from "hooks/analytics/useTrack";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import { NebulaIcon } from "../../app/(app)/(dashboard)/(chain)/components/server/icons/NebulaIcon";
import { ChatBar } from "./ChatBar";
import { type CustomChatMessage, CustomChats } from "./CustomChats";
import type { UserMessage, UserMessageContent } from "./CustomChats";
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
      teamId={props.teamId}
      clientId={props.clientId}
      authToken={props.authToken || ""}
      client={props.client}
      examplePrompts={props.examplePrompts}
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
  const trackEvent = useTrack();
  const [isChatStreaming, setIsChatStreaming] = useState(false);
  const [enableAutoScroll, setEnableAutoScroll] = useState(false);
  const connectionStatus = useActiveWalletConnectionStatus();

  const handleSendMessage = useCallback(
    async (userMessage: UserMessage) => {
      const abortController = new AbortController();
      setUserHasSubmittedMessage(true);
      setIsChatStreaming(true);
      setEnableAutoScroll(true);

      const textMessage = userMessage.content.find(
        (x: UserMessageContent) => x.type === "text",
      );

      trackEvent({
        category: "siwa",
        action: "send-message",
        message: textMessage?.text,
        sessionId: sessionId,
      });

      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: userMessage.content as UserMessageContent[],
        },
        // instant loading indicator feedback to user
        {
          type: "presence",
          texts: [],
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
          message:
            messageToSend.content.find((x) => x.type === "text")?.text ?? "",
          conversationId: sessionId,
          source: "dashboard-support",
        };
        const apiUrl = process.env.NEXT_PUBLIC_SIWA_URL;
        const response = await fetch(`${apiUrl}/v1/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.authToken}`,
            ...(props.teamId ? { "x-team-id": props.teamId } : {}),
            ...(props.clientId ? { "x-client-id": props.clientId } : {}),
          },
          body: JSON.stringify(payload),
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
    [props.authToken, props.clientId, props.teamId, sessionId, trackEvent],
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
        trackEvent({
          category: "siwa",
          action: "submit-feedback",
          rating: feedback === 1 ? "good" : "bad",
          sessionId,
          teamId: props.teamId,
        });

        const apiUrl = process.env.NEXT_PUBLIC_SIWA_URL;
        const response = await fetch(`${apiUrl}/v1/chat/feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.authToken}`,
            ...(props.teamId ? { "x-team-id": props.teamId } : {}),
          },
          body: JSON.stringify({
            conversationId: sessionId,
            feedbackRating: feedback,
          }),
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
    [sessionId, props.authToken, props.teamId, trackEvent, messages],
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
        <CustomChats
          messages={messages}
          isChatStreaming={isChatStreaming}
          authToken={props.authToken}
          sessionId={sessionId}
          className="min-w-0 pb-10"
          client={props.client}
          enableAutoScroll={enableAutoScroll}
          setEnableAutoScroll={setEnableAutoScroll}
          useSmallText
          sendMessage={handleSendMessage}
          onFeedback={handleFeedback}
        />
      )}
      <ChatBar
        placeholder={"Ask AI Assistant"}
        onLoginClick={undefined}
        client={props.client}
        isConnectingWallet={connectionStatus === "connecting"}
        abortChatStream={() => {
          chatAbortController?.abort();
          setChatAbortController(undefined);
          setIsChatStreaming(false);
          // if last message is presence, remove it
          if (messages[messages.length - 1]?.type === "presence") {
            setMessages((prev) => prev.slice(0, -1));
          }
        }}
        isChatStreaming={isChatStreaming}
        prefillMessage={undefined}
        sendMessage={(siwaUserMessage) => {
          const userMessage: UserMessage = {
            type: "user",
            content: siwaUserMessage.content
              .filter((c) => c.type === "text")
              .map((c) => ({ type: "text", text: c.text })),
          };
          handleSendMessage(userMessage);
        }}
        className="rounded-none border-x-0 border-b-0"
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
          href={`/login?next=${encodeURIComponent(pathname)}`}
          className="w-full max-w-96 gap-2"
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
            key={prompt.title}
            variant="outline"
            size="sm"
            onClick={() =>
              props.sendMessage({
                type: "user",
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
