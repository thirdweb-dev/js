import { Button } from "@/components/ui/button";
import { useTrack } from "hooks/analytics/useTrack";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  useActiveWallet,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import type { NebulaContext } from "../../api/chat";
import { createSession } from "../../api/session";
import type { ExamplePrompt } from "../../data/examplePrompts";
import { NebulaIcon } from "../../icons/NebulaIcon";
import { ChatBar } from "../ChatBar";
import {
  handleNebulaPrompt,
  handleNebulaPromptError,
} from "../ChatPageContent";
import { Chats } from "../Chats";
import type { ChatMessage } from "../Chats";

export default function FloatingChatContent(props: {
  authToken: string | undefined;
  client: ThirdwebClient;
  examplePrompts: ExamplePrompt[];
  pageType: "chain" | "contract" | "support";
  networks: NebulaContext["networks"];
  nebulaParams:
    | {
        messagePrefix: string;
        chainIds: number[];
        wallet: string | undefined;
      }
    | undefined;
}) {
  if (!props.authToken) {
    return <LoggedOutStateChatContent />;
  }

  return (
    <FloatingChatContentLoggedIn
      networks={props.networks}
      authToken={props.authToken}
      client={props.client}
      nebulaParams={props.nebulaParams}
      examplePrompts={props.examplePrompts}
      pageType={props.pageType}
    />
  );
}

function FloatingChatContentLoggedIn(props: {
  authToken: string;
  client: ThirdwebClient;
  pageType: "chain" | "contract" | "support";
  examplePrompts: ExamplePrompt[];
  networks: NebulaContext["networks"];
  nebulaParams:
    | {
        messagePrefix: string;
        chainIds: number[];
        wallet: string | undefined;
      }
    | undefined;
}) {
  const [userHasSubmittedMessage, setUserHasSubmittedMessage] = useState(false);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [chatAbortController, setChatAbortController] = useState<
    AbortController | undefined
  >();
  const trackEvent = useTrack();
  const [isChatStreaming, setIsChatStreaming] = useState(false);
  const [enableAutoScroll, setEnableAutoScroll] = useState(false);
  const connectionStatus = useActiveWalletConnectionStatus();
  const activeWallet = useActiveWallet();

  const [contextFilters, setContextFilters] = useState<
    NebulaContext | undefined
  >(() => {
    return {
      chainIds:
        props.nebulaParams?.chainIds.map((chainId) => chainId.toString()) ||
        null,
      walletAddress: props.nebulaParams?.wallet || null,
      networks: props.networks,
    };
  });

  const initSession = useCallback(async () => {
    const session = await createSession({
      authToken: props.authToken,
      context: contextFilters,
    });
    setSessionId(session.id);
    return session;
  }, [props.authToken, contextFilters]);

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      const abortController = new AbortController();
      setUserHasSubmittedMessage(true);
      setIsChatStreaming(true);
      setEnableAutoScroll(true);

      trackEvent({
        category: "floating_nebula",
        action: "send",
        label: "message",
        message: userMessage,
        page: props.pageType,
        sessionId: sessionId,
      });

      // if this is first message, set the message prefix
      const messageToSend =
        props.nebulaParams?.messagePrefix && !userHasSubmittedMessage
          ? `${props.nebulaParams.messagePrefix}\n\n${userMessage}`
          : userMessage;

      setMessages((prev) => [
        ...prev,
        { text: userMessage, type: "user" },
        // instant loading indicator feedback to user
        {
          type: "presence",
          text: "Thinking...",
        },
      ]);

      try {
        // Ensure we have a session ID
        let currentSessionId = sessionId;
        if (!currentSessionId) {
          const session = await initSession();
          currentSessionId = session.id;
        }

        setChatAbortController(abortController);
        await handleNebulaPrompt({
          abortController,
          message: messageToSend,
          sessionId: currentSessionId,
          authToken: props.authToken,
          setMessages,
          contextFilters: contextFilters,
          setContextFilters: setContextFilters,
        });
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        handleNebulaPromptError({
          error,
          setMessages,
        });
      } finally {
        setIsChatStreaming(false);
        setEnableAutoScroll(false);
      }
    },
    [
      props.authToken,
      contextFilters,
      initSession,
      sessionId,
      props.nebulaParams?.messagePrefix,
      userHasSubmittedMessage,
      trackEvent,
      props.pageType,
    ],
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
          isChatStreaming={isChatStreaming}
          authToken={props.authToken}
          sessionId={sessionId}
          className="min-w-0 pb-10"
          client={props.client}
          enableAutoScroll={enableAutoScroll}
          setEnableAutoScroll={setEnableAutoScroll}
          useSmallText
          sendMessage={handleSendMessage}
        />
      )}
      <ChatBar
        client={props.client}
        isConnectingWallet={connectionStatus === "connecting"}
        context={contextFilters}
        setContext={setContextFilters}
        showContextSelector={false}
        connectedWallets={
          props.nebulaParams?.wallet && activeWallet
            ? [
                {
                  address: props.nebulaParams.wallet,
                  walletId: activeWallet.id,
                },
              ]
            : []
        }
        activeAccountAddress={props.nebulaParams?.wallet}
        setActiveWallet={() => {}}
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
        prefillMessage=""
        sendMessage={handleSendMessage}
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
        onchain today?
      </h1>

      <div className="h-3" />
      <p className="text-base text-muted-foreground">
        Sign in to use Nebula AI
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
  sendMessage: (message: string) => void;
  examplePrompts: ExamplePrompt[];
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
        onchain today?
      </h1>

      <div className="h-6" />
      <div className="flex max-w-lg flex-col flex-wrap justify-center gap-2.5">
        {props.examplePrompts.map((prompt) => {
          return (
            <ExamplePromptButton
              key={prompt.title}
              label={prompt.title}
              onClick={() => props.sendMessage(prompt.message)}
            />
          );
        })}
      </div>
    </div>
  );
}

function ExamplePromptButton(props: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="h-auto gap-1.5 rounded-full bg-card px-3 py-2 text-muted-foreground text-xs"
      onClick={props.onClick}
    >
      {props.label} <ArrowUpRightIcon className="size-3" />
    </Button>
  );
}
