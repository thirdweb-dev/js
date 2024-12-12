"use client";

/* eslint-disable no-restricted-syntax */
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { type ContextFilters, promptNebula } from "../api/chat";
import { createSession, updateSession } from "../api/session";
import type { ExecuteConfig, SessionInfo } from "../api/types";
import { newChatPageUrlStore, newSessionsStore } from "../stores";
import { Chatbar } from "./ChatBar";
import { type ChatMessage, Chats } from "./Chats";
import ContextFiltersButton from "./ContextFilters";
import { EmptyStateChatPageContent } from "./EmptyStateChatPageContent";

export function ChatPageContent(props: {
  session: SessionInfo | undefined;
  authToken: string;
  accountAddress: string;
  type: "landing" | "new-chat";
  account: Account;
}) {
  const client = useThirdwebClient();
  const [userHasSubmittedMessage, setUserHasSubmittedMessage] = useState(false);
  const [messages, setMessages] = useState<Array<ChatMessage>>(() => {
    if (props.session?.history) {
      return props.session.history.map((message) => ({
        text: message.content,
        type: message.role,
        request_id: undefined,
      }));
    }
    return [];
  });

  const [_config, setConfig] = useState<ExecuteConfig | null>();
  const [contextFilters, setContextFilters] = useState<
    ContextFilters | undefined
  >(() => {
    const contextFilterRes = props.session?.context_filter;
    if (contextFilterRes) {
      return {
        chainIds: contextFilterRes.chain_ids,
        contractAddresses: contextFilterRes.contract_addresses,
      };
    }
  });

  const config = _config || {
    mode: "client",
    signer_wallet_address: props.accountAddress,
  };

  const [sessionId, _setSessionId] = useState<string | undefined>(
    props.session?.id,
  );

  const [chatAbortController, setChatAbortController] = useState<
    AbortController | undefined
  >();

  function setSessionId(sessionId: string) {
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
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isChatStreaming, setIsChatStreaming] = useState(false);
  const [isUserSubmittedMessage, setIsUserSubmittedMessage] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isUserSubmittedMessage) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isUserSubmittedMessage]);

  async function initSession() {
    const session = await createSession({
      authToken: props.authToken,
      config,
      contextFilters,
    });
    setSessionId(session.id);
    return session;
  }

  async function handleSendMessage(message: string) {
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
    setIsUserSubmittedMessage(true);
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
    }
  }

  async function handleUpdateConfig(newConfig: ExecuteConfig) {
    setConfig(newConfig);

    try {
      if (!sessionId) {
        // If no session exists, create a new one
        await initSession();
      } else {
        await updateSession({
          authToken: props.authToken,
          config: newConfig,
          sessionId,
          contextFilters,
        });
      }
    } catch (error) {
      console.error("Failed to update session", error);
      setMessages((prev) => [
        ...prev,
        {
          text: `Error: Failed to ${sessionId ? "update" : "create"} session`,
          type: "error",
        },
      ]);
    }
  }

  const updateConfig = useMutation({
    mutationFn: handleUpdateConfig,
  });

  const showEmptyState = !userHasSubmittedMessage && messages.length === 0;

  return (
    <div className="flex grow flex-col overflow-hidden">
      <header className="flex justify-end border-b bg-background p-4">
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
      <div className="container relative flex max-w-[800px] grow flex-col overflow-hidden rounded-lg pb-6">
        {showEmptyState ? (
          <div className="fade-in-0 flex grow animate-in flex-col justify-center">
            <EmptyStateChatPageContent
              sendMessage={handleSendMessage}
              config={config}
              updateConfig={() => {
                updateConfig.mutate(config);
              }}
            />
          </div>
        ) : (
          <div className="fade-in-0 relative z-[0] flex max-h-full flex-1 animate-in flex-col overflow-hidden">
            <ScrollShadow
              className="flex-1"
              scrollableClassName="max-h-full"
              shadowColor="hsl(var(--background))"
              shadowClassName="z-[1]"
            >
              <Chats
                messages={messages}
                isChatStreaming={isChatStreaming}
                authToken={props.authToken}
                sessionId={sessionId}
                className="min-w-0 pt-10 pb-32"
                twAccount={props.account}
                client={client}
              />
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </ScrollShadow>

            <Chatbar
              sendMessage={handleSendMessage}
              config={config}
              isChatStreaming={isChatStreaming}
              updateConfig={() => {
                updateConfig.mutate(config);
              }}
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
        )}

        <p className="mt-4 text-center text-muted-foreground text-xs opacity-75 lg:text-sm">
          Nebula may make mistakes. Please use with discretion
        </p>
      </div>
    </div>
  );
}
