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
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { type ContextFilters, promptNebula } from "../api/chat";
import { createSession, updateSession } from "../api/session";
import type { ExecuteConfig, SessionInfo } from "../api/types";
import { newChatPageUrlStore, newSessionsStore } from "../stores";
import { ChatBar } from "./ChatBar";
import { type ChatMessage, Chats } from "./Chats";
import ContextFiltersButton from "./ContextFilters";
import { EmptyStateChatPageContent } from "./EmptyStateChatPageContent";

export function ChatPageContent(props: {
  session: SessionInfo | undefined;
  authToken: string;
  type: "landing" | "new-chat";
  account: Account;
  initialPrompt: string | undefined;
}) {
  const address = useActiveAccount()?.address;
  const activeChain = useActiveWalletChain();
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
    ContextFilters | undefined
  >(() => {
    const contextFilterRes = props.session?.context_filter;
    const value: ContextFilters = {
      chainIds: contextFilterRes?.chain_ids || undefined,
      contractAddresses: contextFilterRes?.contract_addresses || undefined,
      walletAddresses: contextFilterRes?.wallet_addresses || undefined,
    };

    return value;
  });

  const setContextFilters = useCallback((v: ContextFilters | undefined) => {
    _setContextFilters(v);
    setHasUserUpdatedContextFilters(true);
  }, []);

  const isNewSession = !props.session;

  // if this is a new session, user has not manually updated context filters
  // update the context filters to the current user's wallet address and chain id
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!isNewSession || hasUserUpdatedContextFilters) {
      return;
    }

    _setContextFilters((_contextFilters) => {
      const updatedContextFilters: ContextFilters = _contextFilters
        ? { ..._contextFilters }
        : {};

      updatedContextFilters.walletAddresses = address ? [address] : [];
      updatedContextFilters.chainIds = activeChain
        ? [activeChain.id.toString()]
        : [];

      return updatedContextFilters;
    });
  }, [address, isNewSession, hasUserUpdatedContextFilters, activeChain]);

  const config: ExecuteConfig | null = useMemo(() => {
    return address
      ? {
          mode: "client",
          signer_wallet_address: address,
        }
      : null;
  }, [address]);

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
      window.history.replaceState({}, "", `/chat/${sessionId}`);

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
      config,
      contextFilters,
    });
    setSessionId(session.id);
    return session;
  }, [config, contextFilters, props.authToken, setSessionId]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!address) {
        setShowConnectModal(true);
        return;
      }
      setUserHasSubmittedMessage(true);
      setMessages((prev) => [
        ...prev,
        { text: message, type: "user" },
        // instant loading indicator feedback to user
        {
          type: "presence",
          text: "Thinking...",
        },
      ]);

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

        let requestIdForMessage = "";

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

        await promptNebula({
          abortController,
          message: message,
          sessionId: currentSessionId,
          config: config,
          authToken: props.authToken,
          handleStream(res) {
            if (abortController.signal.aborted) {
              return;
            }

            if (res.event === "init") {
              requestIdForMessage = res.data.request_id;
            }

            if (res.event === "delta") {
              setMessages((prev) => {
                const lastMessage = prev[prev.length - 1];
                // if last message is presence, overwrite it
                if (lastMessage?.type === "presence") {
                  return [
                    ...prev.slice(0, -1),
                    {
                      text: res.data.v,
                      type: "assistant",
                      request_id: requestIdForMessage,
                    },
                  ];
                }

                // if last message is from chat, append to it
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

                // otherwise, add a new message
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
                // if last message is presence, overwrite it
                if (lastMessage?.type === "presence") {
                  return [
                    ...prev.slice(0, -1),
                    { text: res.data.data, type: "presence" },
                  ];
                }
                // otherwise, add a new message
                return [...prev, { text: res.data.data, type: "presence" }];
              });
            }

            if (res.event === "action") {
              if (res.type === "sign_transaction") {
                setMessages((prev) => {
                  let prevMessages = prev;
                  // if last message is presence, remove it
                  if (
                    prevMessages[prevMessages.length - 1]?.type === "presence"
                  ) {
                    prevMessages = prevMessages.slice(0, -1);
                  }

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
          },
          contextFilters: contextFilters,
        });
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }
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
      } finally {
        setIsChatStreaming(false);
        setEnableAutoScroll(false);
      }
    },
    [
      sessionId,
      contextFilters,
      config,
      props.authToken,
      messages.length,
      initSession,
      address,
    ],
  );

  const hasDoneAutoPrompt = useRef(false);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (
      props.initialPrompt &&
      messages.length === 0 &&
      !hasDoneAutoPrompt.current
    ) {
      hasDoneAutoPrompt.current = true;
      handleSendMessage(props.initialPrompt);
    }
  }, [props.initialPrompt, messages.length, handleSendMessage]);

  const showEmptyState = !userHasSubmittedMessage && messages.length === 0;

  return (
    <div className="flex grow flex-col overflow-hidden">
      <WalletDisconnectedDialog
        open={showConnectModal}
        onOpenChange={setShowConnectModal}
      />
      <header className="flex justify-start border-b bg-background p-4">
        <ContextFiltersButton
          contextFilters={contextFilters}
          setContextFilters={setContextFilters}
          updateContextFilters={async (values) => {
            // if session is not yet created, don't need to update sessions - starting a chat will create a session with the context filters
            if (sessionId) {
              await updateSession({
                authToken: props.authToken,
                config,
                sessionId,
                contextFilters: values,
              });
            }
          }}
        />
      </header>
      <div className="relative flex grow flex-col overflow-hidden rounded-lg pb-6">
        {showEmptyState ? (
          <div className="fade-in-0 container flex max-w-[800px] grow animate-in flex-col justify-center">
            <EmptyStateChatPageContent sendMessage={handleSendMessage} />
          </div>
        ) : (
          <div className="fade-in-0 relative z-[0] flex max-h-full flex-1 animate-in flex-col overflow-hidden">
            <Chats
              messages={messages}
              isChatStreaming={isChatStreaming}
              authToken={props.authToken}
              sessionId={sessionId}
              className="min-w-0 pt-6 pb-32"
              twAccount={props.account}
              client={client}
              enableAutoScroll={enableAutoScroll}
              setEnableAutoScroll={setEnableAutoScroll}
            />

            <div className="container max-w-[800px]">
              <ChatBar
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
              />
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-muted-foreground text-xs opacity-75 lg:text-sm">
          Nebula may make mistakes. Please use with discretion
        </p>
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

        <div className="flex justify-end gap-3 border-t bg-muted/50 p-6">
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
