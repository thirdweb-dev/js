"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
  useConnectedWallets,
  useSetActiveWallet,
} from "thirdweb/react";
import { type NebulaContext, promptNebula } from "../api/chat";
import { createSession, updateSession } from "../api/session";
import type { SessionInfo } from "../api/types";
import { examplePrompts } from "../data/examplePrompts";
import { newChatPageUrlStore, newSessionsStore } from "../stores";
import { ChatBar, type WalletMeta } from "./ChatBar";
import { type ChatMessage, Chats } from "./Chats";
import { EmptyStateChatPageContent } from "./EmptyStateChatPageContent";

export function ChatPageContent(props: {
  session: SessionInfo | undefined;
  accountAddress: string;
  authToken: string;
  type: "landing" | "new-chat";
  initialParams:
    | {
        q: string | undefined;
        chainIds: number[];
      }
    | undefined;
}) {
  const address = useActiveAccount()?.address;
  const connectedWallets = useConnectedWallets();
  const setActiveWallet = useSetActiveWallet();

  const client = useThirdwebClient(props.authToken);
  const [userHasSubmittedMessage, setUserHasSubmittedMessage] = useState(false);
  const [messages, setMessages] = useState<Array<ChatMessage>>(() => {
    if (props.session?.history) {
      const _messages: ChatMessage[] = [];

      for (const message of props.session.history) {
        if (message.role === "action") {
          try {
            const content = JSON.parse(message.content) as {
              session_id: string;
              data: string;
              type: "sign_transaction" | (string & {});
            };

            if (content.type === "sign_transaction") {
              const txData = JSON.parse(content.data);
              if (
                typeof txData === "object" &&
                txData !== null &&
                txData.chainId
              ) {
                _messages.push({
                  type: "send_transaction",
                  data: txData,
                });
              }
            }
          } catch {
            // ignore
          }
        } else {
          _messages.push({
            text: message.content,
            type: message.role,
            request_id: undefined,
          });
        }
      }

      return _messages;
    }
    return [];
  });

  const [hasUserUpdatedContextFilters, setHasUserUpdatedContextFilters] =
    useState(false);

  const [contextFilters, _setContextFilters] = useState<
    NebulaContext | undefined
  >(() => {
    const contextRes = props.session?.context;
    const value: NebulaContext = {
      chainIds:
        contextRes?.chain_ids ||
        props.initialParams?.chainIds.map((x) => x.toString()) ||
        [],
      walletAddress: contextRes?.wallet_address || props.accountAddress || null,
      networks: "mainnet",
    };

    return value;
  });

  const setContextFilters = useCallback((v: NebulaContext | undefined) => {
    _setContextFilters(v);
    setHasUserUpdatedContextFilters(true);
    saveLastUsedChainIds(v?.chainIds || undefined);
  }, []);

  const isNewSession = !props.session;
  const connectionStatus = useActiveWalletConnectionStatus();

  // if this is a new session, user has not manually updated context
  // update the context to the current user's wallet address and chain id
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!isNewSession || hasUserUpdatedContextFilters) {
      return;
    }

    _setContextFilters((_contextFilters) => {
      const updatedContextFilters: NebulaContext = _contextFilters
        ? {
            ..._contextFilters,
          }
        : {
            chainIds: [],
            walletAddress: null,
            networks: null,
          };

      if (!updatedContextFilters.walletAddress && address) {
        updatedContextFilters.walletAddress = address;
      }

      if (
        updatedContextFilters.chainIds?.length === 0 &&
        !props.initialParams?.q
      ) {
        // if we have last used chains in storage, continue using them
        try {
          const lastUsedChainIds = getLastUsedChainIds();
          if (lastUsedChainIds) {
            updatedContextFilters.chainIds = lastUsedChainIds;
            return updatedContextFilters;
          }
        } catch {
          // ignore local storage errors
        }
      }

      return updatedContextFilters;
    });
  }, [
    address,
    isNewSession,
    hasUserUpdatedContextFilters,
    props.initialParams?.q,
  ]);

  const [sessionId, _setSessionId] = useState<string | undefined>(
    props.session?.id,
  );

  const [chatAbortController, setChatAbortController] = useState<
    AbortController | undefined
  >();

  const setSessionId = useCallback(
    (sessionId: string) => {
      _setSessionId(sessionId);
      // update page URL without reloading
      // THIS DOES NOT WORK ANYMORE!! - NEXT JS IS MONKEY PATCHING THIS TOO
      // Until we find a better solution, we are just not gonna update the URL
      // window.history.replaceState({}, "", `/chat/${sessionId}`);

      // if the current page is landing page, link to /chat
      // if current page is new /chat page, link to landing page
      if (props.type === "landing") {
        newChatPageUrlStore.setValue("/chat");
      } else {
        newChatPageUrlStore.setValue("/");
      }
    },
    [props.type],
  );

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
  }, [contextFilters, props.authToken, setSessionId]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      setUserHasSubmittedMessage(true);
      setMessages((prev) => [
        ...prev,
        { text: message, type: "user" },
        // instant loading indicator feedback to user
        {
          type: "presence",
          texts: [],
        },
      ]);

      // handle hardcoded replies first
      const lowerCaseMessage = message.toLowerCase();
      const interceptedReply = examplePrompts.find(
        (prompt) => prompt.message.toLowerCase() === lowerCaseMessage,
      )?.interceptedReply;
      if (interceptedReply) {
        // slight delay to match other response times
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { type: "assistant", text: interceptedReply, request_id: undefined },
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

        // add this session on sidebar
        if (messages.length === 0) {
          const prevValue = newSessionsStore.getValue();
          newSessionsStore.setValue([
            {
              id: currentSessionId,
              title: message,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            ...prevValue,
          ]);
        }

        setChatAbortController(abortController);

        await handleNebulaPrompt({
          abortController,
          message,
          sessionId: currentSessionId,
          authToken: props.authToken,
          setMessages,
          contextFilters: contextFilters,
          setContextFilters,
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
      handleSendMessage(props.initialParams.q);
    }
  }, [props.initialParams?.q, messages.length, handleSendMessage]);

  const showEmptyState =
    !userHasSubmittedMessage &&
    messages.length === 0 &&
    !props.initialParams?.q;

  const connectedWalletsMeta: WalletMeta[] = connectedWallets.map((x) => ({
    address: x.getAccount()?.address || "",
    walletId: x.id,
  }));

  const handleUpdateContextFilters = async (
    values: NebulaContext | undefined,
  ) => {
    // if session is not yet created, don't need to update sessions - starting a chat will create a session with the context
    if (sessionId) {
      await updateSession({
        authToken: props.authToken,
        sessionId,
        contextFilters: values,
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
        open={showConnectModal}
        onOpenChange={setShowConnectModal}
      />

      <div className="flex grow overflow-hidden">
        <div className="relative flex grow flex-col overflow-hidden rounded-lg pb-6">
          {showEmptyState ? (
            <div className="fade-in-0 container flex max-w-[800px] grow animate-in flex-col justify-center">
              <EmptyStateChatPageContent
                showAurora={true}
                isConnectingWallet={connectionStatus === "connecting"}
                sendMessage={handleSendMessage}
                prefillMessage={props.initialParams?.q}
                context={contextFilters}
                setContext={setContextFilters}
                connectedWallets={connectedWalletsMeta}
                activeAccountAddress={address}
                setActiveWallet={handleSetActiveWallet}
              />
            </div>
          ) : (
            <div className="fade-in-0 relative z-[0] flex max-h-full flex-1 animate-in flex-col overflow-hidden">
              <Chats
                messages={messages}
                isChatStreaming={isChatStreaming}
                authToken={props.authToken}
                sessionId={sessionId}
                className="min-w-0 pt-6 pb-32"
                client={client}
                enableAutoScroll={enableAutoScroll}
                setEnableAutoScroll={setEnableAutoScroll}
                sendMessage={handleSendMessage}
              />

              <div className="container max-w-[800px]">
                <ChatBar
                  isConnectingWallet={connectionStatus === "connecting"}
                  showContextSelector={true}
                  connectedWallets={connectedWalletsMeta}
                  activeAccountAddress={address}
                  setActiveWallet={handleSetActiveWallet}
                  client={client}
                  prefillMessage={undefined}
                  sendMessage={handleSendMessage}
                  isChatStreaming={isChatStreaming}
                  abortChatStream={() => {
                    chatAbortController?.abort();
                    setChatAbortController(undefined);
                    setIsChatStreaming(false);
                    // if last message is presence, remove it
                    if (messages[messages.length - 1]?.type === "presence") {
                      setMessages((prev) => prev.slice(0, -1));
                    }
                  }}
                  context={contextFilters}
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
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
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
            <Link href="/login" className="gap-2">
              Connect Wallet
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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

export async function handleNebulaPrompt(params: {
  abortController: AbortController;
  message: string;
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
    message,
    sessionId,
    authToken,
    handleStream(res) {
      if (abortController.signal.aborted) {
        return;
      }

      if (res.event === "init") {
        requestIdForMessage = res.data.request_id;
      }

      if (res.event === "delta") {
        // ignore empty string delta
        if (!res.data.v) {
          return;
        }

        hasReceivedResponse = true;
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];

          // append to previous assistant message
          if (lastMessage?.type === "assistant") {
            return [
              ...prev.slice(0, -1),
              {
                text: lastMessage.text + res.data.v,
                type: "assistant",
                request_id: requestIdForMessage,
              },
            ];
          }

          // start a new assistant message
          return [
            ...prev,
            {
              text: res.data.v,
              type: "assistant",
              request_id: requestIdForMessage,
            },
          ];
        });
      }

      if (res.event === "presence") {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];

          // append to previous presence message
          if (lastMessage?.type === "presence") {
            return [
              ...prev.slice(0, -1),
              {
                type: "presence",
                texts: [...lastMessage.texts, res.data.data],
              },
            ];
          }

          // start a new presence message
          return [...prev, { texts: [res.data.data], type: "presence" }];
        });
      }

      if (res.event === "action") {
        if (res.type === "sign_transaction") {
          hasReceivedResponse = true;
          setMessages((prevMessages) => {
            return [
              ...prevMessages,
              {
                type: "send_transaction",
                data: res.data,
              },
            ];
          });
        }
      }

      if (res.event === "context") {
        setContextFilters({
          chainIds: res.data.chain_ids.map((x) => x.toString()),
          walletAddress: res.data.wallet_address,
          networks: res.data.networks,
        });
      }
    },
    context: contextFilters,
  });

  // if the stream ends without any delta or tx events - we have nothing to show
  // show an error message in that case
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

export function handleNebulaPromptError(params: {
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

    // add error message
    newMessages.push({
      text: `Error: ${error instanceof Error ? error.message : "Failed to execute command"}`,
      type: "error",
    });

    return newMessages;
  });
}
