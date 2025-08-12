"use client";
import { ArrowRightIcon, MessageSquareXIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
  useConnectedWallets,
  useSetActiveWallet,
} from "thirdweb/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type NebulaContext, promptNebula } from "../api/chat";
import { createSession, updateSession } from "../api/session";
import type {
  NebulaSessionHistoryMessage,
  NebulaUserMessage,
  SessionInfo,
} from "../api/types";
import { examplePrompts } from "../data/examplePrompts";
import { newSessionsStore } from "../stores";

// Simplified types for the playground version
export type WalletMeta = {
  walletId: string;
  address: string;
};

export type ChatMessage =
  | {
      type: "user";
      content: NebulaUserMessage["content"];
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
      request_id: string | undefined;
      text: string;
      type: "assistant";
    };

export function ChatPageContent(props: {
  session: SessionInfo | undefined;
  accountAddress: string;
  authToken: string;
  client: ThirdwebClient;
  type: "landing" | "new-chat";
  initialParams:
    | {
        q: string | undefined;
        chainIds: number[];
      }
    | undefined;
}) {
  const address = useActiveAccount()?.address;
  const connectionStatus = useActiveWalletConnectionStatus();
  const connectedWallets = useConnectedWallets();
  const setActiveWallet = useSetActiveWallet();

  const [userHasSubmittedMessage, setUserHasSubmittedMessage] = useState(false);
  const [messages, setMessages] = useState<Array<ChatMessage>>(() => {
    if (props.session?.history) {
      return parseHistoryToMessages(props.session.history);
    }
    return [];
  });

  const [_contextFilters, _setContextFilters] = useState<
    NebulaContext | undefined
  >(() => {
    const contextRes = props.session?.context;
    const value: NebulaContext = {
      chainIds:
        contextRes?.chain_ids ||
        props.initialParams?.chainIds.map((x) => x.toString()) ||
        [],
      networks: "mainnet",
      walletAddress: contextRes?.wallet_address || props.accountAddress || null,
    };

    return value;
  });

  const contextFilters = useMemo(() => {
    return {
      chainIds: _contextFilters?.chainIds || [],
      networks: _contextFilters?.networks || null,
      walletAddress: address || _contextFilters?.walletAddress || null,
    } satisfies NebulaContext;
  }, [_contextFilters, address]);

  const setContextFilters = useCallback((v: NebulaContext | undefined) => {
    _setContextFilters(v);
    saveLastUsedChainIds(v?.chainIds || undefined);
  }, []);

  const shouldRunEffect = useRef(true);
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (props.session || props.initialParams?.q || !shouldRunEffect.current) {
      return;
    }

    shouldRunEffect.current = false;

    _setContextFilters((_contextFilters) => {
      try {
        const lastUsedChainIds = getLastUsedChainIds();
        if (lastUsedChainIds) {
          return {
            chainIds: lastUsedChainIds,
            networks: _contextFilters?.networks || null,
            walletAddress: _contextFilters?.walletAddress || null,
          };
        }
      } catch {
        // ignore local storage errors
      }

      return _contextFilters;
    });
  }, [props.session, props.initialParams?.q]);

  const [sessionId, setSessionId] = useState<string | undefined>(
    props.session?.id,
  );

  const [chatAbortController, setChatAbortController] = useState<
    AbortController | undefined
  >();

  const [isChatStreaming, setIsChatStreaming] = useState(false);
  const [enableAutoScroll, setEnableAutoScroll] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const initSession = useCallback(async () => {
    const session = await createSession({
      authToken: props.authToken,
      context: contextFilters,
    });
    setSessionId(session.id);
    return session;
  }, [contextFilters, props.authToken]);

  const handleSendMessage = useCallback(
    async (message: NebulaUserMessage) => {
      setUserHasSubmittedMessage(true);
      setMessages((prev) => [
        ...prev,
        {
          content: message.content,
          type: "user",
        },
        {
          texts: [],
          type: "presence",
        },
      ]);

      // handle hardcoded replies first
      const lowerCaseMessage = message.content
        .find((x) => x.type === "text")
        ?.text.toLowerCase();

      const interceptedReply = examplePrompts.find(
        (prompt) => prompt.message.toLowerCase() === lowerCaseMessage,
      )?.interceptedReply;
      if (interceptedReply) {
        // slight delay to match other response times
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { request_id: undefined, text: interceptedReply, type: "assistant" },
        ]);

        return;
      }

      setIsChatStreaming(true);
      setEnableAutoScroll(true);
      const abortController = new AbortController();

      try {
        // Ensure we have a session ID
        let currentSessionId = sessionId;
        if (!currentSessionId) {
          const session = await initSession();
          currentSessionId = session.id;
        }

        const firstTextMessage =
          message.role === "user"
            ? message.content.find((x) => x.type === "text")?.text || ""
            : "";

        // add this session on sidebar
        if (messages.length === 0 && firstTextMessage) {
          const prevValue = newSessionsStore.getValue();
          newSessionsStore.setValue([
            {
              created_at: new Date().toISOString(),
              id: currentSessionId,
              title: firstTextMessage,
              updated_at: new Date().toISOString(),
            },
            ...prevValue,
          ]);
        }

        setChatAbortController(abortController);

        await handleNebulaPrompt({
          abortController,
          authToken: props.authToken,
          contextFilters: contextFilters,
          message: message,
          sessionId: currentSessionId,
          setContextFilters,
          setMessages,
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
      sessionId,
      contextFilters,
      props.authToken,
      messages.length,
      initSession,
      setContextFilters,
    ],
  );

  const hasDoneAutoPrompt = useRef(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (
      props.initialParams?.q &&
      messages.length === 0 &&
      !hasDoneAutoPrompt.current
    ) {
      hasDoneAutoPrompt.current = true;
      handleSendMessage({
        content: [
          {
            text: props.initialParams.q,
            type: "text",
          },
        ],
        role: "user",
      });
    }
  }, [props.initialParams?.q, messages.length, handleSendMessage]);

  const showEmptyState =
    !userHasSubmittedMessage &&
    messages.length === 0 &&
    !props.session &&
    !props.initialParams?.q;

  const sessionWithNoMessages = props.session && messages.length === 0;

  const connectedWalletsMeta: WalletMeta[] = connectedWallets.map((x) => ({
    address: x.getAccount()?.address || "",
    walletId: x.id,
  }));

  const handleUpdateContextFilters = async (
    values: NebulaContext | undefined,
  ) => {
    if (sessionId) {
      await updateSession({
        authToken: props.authToken,
        contextFilters: values,
        sessionId,
      });
    }
  };

  const handleSetActiveWallet = (walletMeta: WalletMeta) => {
    const wallet = connectedWallets.find(
      (x) => x.getAccount()?.address === walletMeta.address,
    );
    if (wallet) {
      setActiveWallet(wallet);
    }
  };

  return (
    <div className="flex grow flex-col overflow-hidden">
      <WalletDisconnectedDialog
        onOpenChange={setShowConnectModal}
        open={showConnectModal}
      />

      <div className="flex grow overflow-hidden">
        <div className="relative flex grow flex-col overflow-hidden rounded-lg pb-4">
          {showEmptyState ? (
            <div className="fade-in-0 container flex max-w-[800px] grow animate-in flex-col justify-center">
              <EmptyStateChatPageContent
                connectedWallets={connectedWalletsMeta}
                context={contextFilters}
                isConnectingWallet={connectionStatus === "connecting"}
                sendMessage={handleSendMessage}
                setActiveWallet={handleSetActiveWallet}
                setContext={setContextFilters}
              />
            </div>
          ) : (
            <div className="fade-in-0 relative z-[0] flex max-h-full flex-1 animate-in flex-col overflow-hidden">
              {sessionWithNoMessages && (
                <div className="container flex max-h-full max-w-[800px] flex-1 flex-col justify-center py-8">
                  <div className="flex flex-col items-center justify-center p-4">
                    <div className="mb-5 rounded-full border bg-card p-3">
                      <MessageSquareXIcon className="size-6 text-muted-foreground" />
                    </div>
                    <p className="mb-1 text-center text-foreground">
                      No messages found
                    </p>
                    <p className="text-balance text-center text-muted-foreground text-sm">
                      This session was aborted before receiving any messages
                    </p>
                  </div>
                </div>
              )}

              {messages.length > 0 && (
                <SimpleChats
                  authToken={props.authToken}
                  className="min-w-0 pt-6 pb-32"
                  client={props.client}
                  enableAutoScroll={enableAutoScroll}
                  isChatStreaming={isChatStreaming}
                  messages={messages}
                  sendMessage={handleSendMessage}
                  sessionId={sessionId}
                  setEnableAutoScroll={setEnableAutoScroll}
                />
              )}

              <div className="container max-w-[800px]">
                <SimpleChatBar
                  abortChatStream={() => {
                    chatAbortController?.abort();
                    setChatAbortController(undefined);
                    setIsChatStreaming(false);
                  }}
                  client={props.client}
                  connectedWallets={connectedWalletsMeta}
                  context={contextFilters}
                  isChatStreaming={isChatStreaming}
                  isConnectingWallet={connectionStatus === "connecting"}
                  placeholder="Ask Nebula"
                  sendMessage={handleSendMessage}
                  setActiveWallet={handleSetActiveWallet}
                  setContext={(v) => {
                    setContextFilters(v);
                    handleUpdateContextFilters(v);
                  }}
                />
              </div>
            </div>
          )}

          <p className="mt-4 text-center text-muted-foreground text-xs opacity-75 lg:text-sm">
            Nebula may make mistakes. Please use with discretion
          </p>
        </div>
      </div>
    </div>
  );
}

function WalletDisconnectedDialog(props: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  return (
    <Dialog onOpenChange={props.onOpenChange} open={props.open}>
      <DialogContent className="p-0">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle> Wallet Disconnected </DialogTitle>
            <DialogDescription>
              Connect your wallet to continue
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex justify-end gap-3 border-t bg-card p-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button asChild>
            <Link className="gap-2" href="/login">
              Connect Wallet
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Simplified components for playground
function EmptyStateChatPageContent(props: {
  sendMessage: (message: NebulaUserMessage) => void;
  context: NebulaContext | undefined;
  setContext: (context: NebulaContext | undefined) => void;
  connectedWallets: WalletMeta[];
  setActiveWallet: (wallet: WalletMeta) => void;
  isConnectingWallet: boolean;
}) {
  return (
    <div className="overflow-hidden py-10 lg:py-16">
      <div className="relative py-10">
        <div className="flex justify-center">
          <div className="rounded-full border p-4 bg-card">
            <MessageSquareXIcon className="size-8 text-muted-foreground" />
          </div>
        </div>
        <div className="h-5" />
        <h1 className="px-4 text-center font-semibold text-3xl tracking-tight md:text-4xl">
          How can I help you <br /> onchain today?
        </h1>
        <div className="h-5" />
        <div className="mx-auto max-w-[600px]">
          <SimpleChatBar
            abortChatStream={() => {}}
            client={{} as ThirdwebClient}
            connectedWallets={props.connectedWallets}
            context={props.context}
            isChatStreaming={false}
            isConnectingWallet={props.isConnectingWallet}
            placeholder="Ask Nebula"
            sendMessage={props.sendMessage}
            setActiveWallet={props.setActiveWallet}
            setContext={props.setContext}
          />
          <div className="h-5" />
          <div className="flex flex-wrap justify-center gap-2.5">
            {examplePrompts.map((prompt) => {
              return (
                <Button
                  key={prompt.title}
                  className="h-auto gap-1.5 rounded-full bg-card px-3 py-1 text-muted-foreground text-xs"
                  onClick={() =>
                    props.sendMessage({
                      content: [{ text: prompt.message, type: "text" }],
                      role: "user",
                    })
                  }
                  variant="outline"
                >
                  {prompt.title} <ArrowRightIcon className="size-3" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleChatBar(props: {
  sendMessage: (message: NebulaUserMessage) => void;
  isChatStreaming: boolean;
  abortChatStream: () => void;
  context: NebulaContext | undefined;
  setContext: (context: NebulaContext | undefined) => void;
  client: ThirdwebClient;
  connectedWallets: WalletMeta[];
  setActiveWallet: (wallet: WalletMeta) => void;
  isConnectingWallet: boolean;
  placeholder: string;
}) {
  const [message, setMessage] = useState("");

  function handleSubmit(message: string) {
    const userMessage: NebulaUserMessage = {
      content: [{ text: message, type: "text" }],
      role: "user",
    };
    props.sendMessage(userMessage);
    setMessage("");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card transition-colors p-2">
      <div className="max-h-[200px] overflow-y-auto">
        <textarea
          className="min-h-[60px] w-full resize-none border-none bg-transparent pt-2 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
          disabled={props.isChatStreaming}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.shiftKey) {
              return;
            }
            if (e.key === "Enter" && !props.isChatStreaming) {
              e.preventDefault();
              handleSubmit(message);
            }
          }}
          placeholder={props.placeholder}
          value={message}
        />
      </div>

      <div className="flex items-end justify-between gap-3 px-2 pb-2">
        <div className="grow"></div>
        <div className="flex items-center gap-2">
          {props.isChatStreaming ? (
            <Button
              className="!h-auto w-auto shrink-0 gap-2 p-2"
              onClick={() => {
                props.abortChatStream();
              }}
              variant="default"
            >
              Stop
            </Button>
          ) : (
            <Button
              aria-label="Send"
              className="!h-auto w-auto p-2"
              disabled={
                message.trim() === "" || props.isConnectingWallet
              }
              onClick={() => {
                if (message.trim() === "") return;
                handleSubmit(message);
              }}
              variant="default"
            >
              Send
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SimpleChats(props: {
  messages: Array<ChatMessage>;
  isChatStreaming: boolean;
  authToken: string;
  sessionId: string | undefined;
  className?: string;
  client: ThirdwebClient;
  setEnableAutoScroll: (enable: boolean) => void;
  enableAutoScroll: boolean;
  sendMessage: (message: NebulaUserMessage) => void;
}) {
  const { messages, setEnableAutoScroll, enableAutoScroll } = props;
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  // auto scroll to bottom when messages change
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!enableAutoScroll || messages.length === 0) {
      return;
    }

    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, enableAutoScroll]);

  return (
    <div className="relative flex max-h-full flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-[800px]">
          <div className={`flex flex-col gap-5 py-4 ${props.className}`}>
            {props.messages.map((message, index) => {
              const isMessagePending =
                props.isChatStreaming && index === props.messages.length - 1;

              return (
                <div
                  className="fade-in-0 min-w-0 animate-in pt-1 text-sm duration-300 lg:text-base"
                  key={index}
                >
                  <RenderMessage
                    isMessagePending={isMessagePending}
                    message={message}
                  />
                </div>
              );
            })}
            <div ref={scrollAnchorRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RenderMessage(props: {
  message: ChatMessage;
  isMessagePending: boolean;
}) {
  const { message } = props;

  if (props.message.type === "user") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        {props.message.content.map((msg, index) => {
          if (msg.type === "text") {
            return (
              <div className="flex justify-end" key={index}>
                <div className="max-w-[80%] overflow-auto rounded-xl border bg-card px-4 py-2">
                  <p className="leading-normal">{msg.text}</p>
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
      <div className="-translate-y-[2px] relative shrink-0">
        <div className="flex size-9 items-center justify-center rounded-full border bg-card">
          <MessageSquareXIcon className="size-5 text-muted-foreground" />
        </div>
      </div>

      <div className="min-w-0 grow">
        <div className="rounded-lg">
          {message.type === "assistant" && (
            <div className="prose prose-sm max-w-none">
              <p>{message.text}</p>
            </div>
          )}

          {message.type === "presence" && (
            <div className="text-muted-foreground text-sm">
              {message.texts.join(" ")}
            </div>
          )}

          {message.type === "error" && (
            <div className="rounded-xl border bg-card px-4 py-2 text-destructive leading-normal">
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const NEBULA_LAST_USED_CHAIN_IDS_KEY = "nebula-last-used-chain-ids";

function saveLastUsedChainIds(chainIds: string[] | undefined) {
  try {
    if (chainIds && chainIds.length > 0) {
      localStorage.setItem(
        NEBULA_LAST_USED_CHAIN_IDS_KEY,
        JSON.stringify(chainIds),
      );
    } else {
      localStorage.removeItem(NEBULA_LAST_USED_CHAIN_IDS_KEY);
    }
  } catch {
    // ignore local storage errors
  }
}

function getLastUsedChainIds(): string[] | null {
  try {
    const lastUsedChainIdsStr = localStorage.getItem(
      NEBULA_LAST_USED_CHAIN_IDS_KEY,
    );
    return lastUsedChainIdsStr ? JSON.parse(lastUsedChainIdsStr) : null;
  } catch {
    return null;
  }
}

async function handleNebulaPrompt(params: {
  abortController: AbortController;
  message: NebulaUserMessage;
  sessionId: string;
  authToken: string;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  contextFilters: NebulaContext | undefined;
  setContextFilters: (v: NebulaContext | undefined) => void;
}) {
  const {
    abortController,
    message,
    sessionId,
    authToken,
    setMessages,
    contextFilters,
    setContextFilters,
  } = params;
  let requestIdForMessage = "";
  let hasReceivedResponse = false;

  await promptNebula({
    abortController,
    authToken,
    context: contextFilters,
    handleStream(res) {
      if (abortController.signal.aborted) {
        return;
      }

      switch (res.event) {
        case "init": {
          requestIdForMessage = res.data.request_id;
          return;
        }

        case "delta": {
          if (!res.data.v) {
            return;
          }

          hasReceivedResponse = true;
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];

            if (lastMessage?.type === "assistant") {
              return [
                ...prev.slice(0, -1),
                {
                  request_id: requestIdForMessage,
                  text: lastMessage.text + res.data.v,
                  type: "assistant",
                },
              ];
            }

            return [
              ...prev,
              {
                request_id: requestIdForMessage,
                text: res.data.v,
                type: "assistant",
              },
            ];
          });
          return;
        }

        case "presence": {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];

            if (lastMessage?.type === "presence") {
              return [
                ...prev.slice(0, -1),
                {
                  texts: [...lastMessage.texts, res.data.data],
                  type: "presence",
                },
              ];
            }

            return [...prev, { texts: [res.data.data], type: "presence" }];
          });
          return;
        }

        case "context": {
          setContextFilters({
            chainIds: res.data.chain_ids.map((x) => x.toString()),
            networks: res.data.networks,
            walletAddress: res.data.wallet_address,
          });
          return;
        }

        case "error": {
          hasReceivedResponse = true;
          setMessages((prev) => {
            return [
              ...prev,
              {
                text: res.data.errorMessage,
                type: "error",
              },
            ];
          });
          return;
        }
      }
    },
    message,
    sessionId,
  });

  if (!hasReceivedResponse) {
    setMessages((prev) => {
      const newMessages = [...prev];

      newMessages.push({
        text: "No response received, please try again",
        type: "error",
      });

      return newMessages;
    });
  }
}

function handleNebulaPromptError(params: {
  error: unknown;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}) {
  const { error, setMessages } = params;
  console.error(error);

  setMessages((prev) => {
    const newMessages = prev.slice(
      0,
      prev[prev.length - 1]?.type === "presence" ? -1 : undefined,
    );

    newMessages.push({
      text: `Error: ${error instanceof Error ? error.message : "Failed to execute command"}`,
      type: "error",
    });

    return newMessages;
  });
}

function parseHistoryToMessages(history: NebulaSessionHistoryMessage[]) {
  const messages: ChatMessage[] = [];

  for (const message of history) {
    switch (message.role) {
      case "user": {
        messages.push({
          content:
            typeof message.content === "string"
              ? [
                  {
                    text: message.content,
                    type: "text",
                  },
                ]
              : message.content,
          type: message.role,
        });
        break;
      }

      case "assistant": {
        messages.push({
          request_id: undefined,
          text: message.content,
          type: message.role,
        });
      }
    }
  }

  return messages;
}