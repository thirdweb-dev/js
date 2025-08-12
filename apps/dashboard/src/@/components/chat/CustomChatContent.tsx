"use client";
import { useCallback, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWalletConnectionStatus } from "thirdweb/react";
import type { Team } from "@/api/team/get-team";
import { Button } from "@/components/ui/button";
import { ThirdwebMiniLogo } from "../../../app/(app)/components/ThirdwebMiniLogo";
import { ChatBar } from "./ChatBar";
import type { UserMessage, UserMessageContent } from "./CustomChats";
import { type CustomChatMessage, CustomChats } from "./CustomChats";
import type { ExamplePrompt } from "./types";

export default function CustomChatContent(props: {
  authToken: string | undefined;
  team: Team;
  clientId: string | undefined;
  client: ThirdwebClient;
  examplePrompts: ExamplePrompt[];
}) {
  return (
    <CustomChatContentLoggedIn
      authToken={props.authToken || ""}
      client={props.client}
      clientId={props.clientId}
      examplePrompts={props.examplePrompts}
      team={props.team}
    />
  );
}

function CustomChatContentLoggedIn(props: {
  authToken: string;
  team: Team;
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

  const [showSupportForm, setShowSupportForm] = useState(false);
  const [productLabel, setProductLabel] = useState("");

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
            "x-team-id": props.team.id,
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
    [props.authToken, props.clientId, props.team.id, sessionId],
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
            "x-team-id": props.team.id,
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
    [sessionId, props.authToken, props.team.id, messages],
  );

  const handleAddSuccessMessage = useCallback((message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        type: "assistant" as const,
        text: message,
        request_id: undefined,
      },
    ]);
  }, []);

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
          showSupportForm={showSupportForm}
          setShowSupportForm={setShowSupportForm}
          productLabel={productLabel}
          setProductLabel={setProductLabel}
          team={props.team}
          addSuccessMessage={handleAddSuccessMessage}
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

function EmptyStateChatPageContent(props: {
  sendMessage: (message: UserMessage) => void;
  examplePrompts: { title: string; message: string }[];
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-auto p-4 ">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full border p-1 bg-muted/20">
          <div className="rounded-full border p-2 bg-inverted">
            <ThirdwebMiniLogo
              isMonoChrome
              className="size-7 text-inverted-foreground"
            />
          </div>
        </div>
      </div>

      <h1 className="px-4 text-center font-semibold text-3xl tracking-tight md:text-4xl">
        How can I help you <br className="max-sm:hidden" />
        today?
      </h1>

      <div className="h-6" />
      <div className="flex flex-col items-center justify-center gap-2.5 overflow-hidden">
        {props.examplePrompts.map((prompt) => (
          <Button
            disabled={false}
            key={prompt.title}
            className="rounded-full text-xs sm:text-sm truncate bg-card w-fit h-auto py-1.5 whitespace-pre-wrap"
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
