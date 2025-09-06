"use client";
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  MessageCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { defineChain, prepareTransaction, type ThirdwebClient } from "thirdweb";
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletConnectionStatus,
  useConnectedWallets,
  useSetActiveWallet,
  WalletIcon,
  WalletProvider,
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
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { Img } from "../../../components/ui/Img";
import { Spinner } from "../../../components/ui/Spinner";
import { THIRDWEB_CLIENT } from "../../../lib/client";
import { promptNebula } from "../api/chat";
import type {
  ChatMessage,
  NebulaContext,
  NebulaUserMessage,
  WalletMeta,
} from "../api/types";
import { examplePrompts } from "../data/examplePrompts";
import { resolveSchemeWithErrorHandler } from "./resolveSchemeWithErrorHandler";

export function ChatPageContent(props: {
  client: ThirdwebClient;
  type: "landing" | "new-chat";
}) {
  const address = useActiveAccount()?.address;
  const connectionStatus = useActiveWalletConnectionStatus();
  const connectedWallets = useConnectedWallets();
  const setActiveWallet = useSetActiveWallet();

  const [userHasSubmittedMessage, setUserHasSubmittedMessage] = useState(false);
  const [messages, setMessages] = useState<Array<ChatMessage>>(() => {
    return [];
  });

  const [_contextFilters, _setContextFilters] = useState<
    NebulaContext | undefined
  >(() => {
    const value: NebulaContext = {
      chainIds: [],
      sessionId: null,
      walletAddress: address || null,
    };

    return value;
  });

  const contextFilters = useMemo(() => {
    // Parse user-entered chain IDs
    const userChainIdArray = userChainIds
      .split(',')
      .map(id => id.trim())
      .filter(id => id !== '' && !isNaN(Number(id)));

    return {
      chainIds: userChainIdArray.length > 0 ? userChainIdArray : (_contextFilters?.chainIds || []),
      sessionId: _contextFilters?.sessionId || null,
      walletAddress: userWalletAddress.trim() || address || _contextFilters?.walletAddress || null,
      autoExecuteTransactions: userAutoExecute,
    } satisfies NebulaContext;
  }, [_contextFilters, address, userWalletAddress, userChainIds, userAutoExecute]);

  const setContextFilters = useCallback((v: NebulaContext | undefined) => {
    _setContextFilters(v);
    saveLastUsedChainIds(v?.chainIds || undefined);
  }, []);

  const shouldRunEffect = useRef(true);
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!shouldRunEffect.current) {
      return;
    }

    shouldRunEffect.current = false;

    _setContextFilters((_contextFilters) => {
      try {
        const lastUsedChainIds = getLastUsedChainIds();
        if (lastUsedChainIds) {
          return {
            chainIds: lastUsedChainIds,
            sessionId: _contextFilters?.sessionId || null,
            walletAddress: _contextFilters?.walletAddress || null,
          };
        }
      } catch {
        // ignore local storage errors
      }

      return _contextFilters;
    });
  }, []);

  const [chatAbortController, setChatAbortController] = useState<
    AbortController | undefined
  >();

  const [isChatStreaming, setIsChatStreaming] = useState(false);
  const [enableAutoScroll, setEnableAutoScroll] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // User-configurable context options
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [userChainIds, setUserChainIds] = useState("");
  const [userAutoExecute, setUserAutoExecute] = useState(false);

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
        setChatAbortController(abortController);

        await handleNebulaPrompt({
          abortController,
          contextFilters: contextFilters,
          message: message,
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
    [contextFilters, setContextFilters],
  );

  const hasDoneAutoPrompt = useRef(false);

  const showEmptyState =
    !userHasSubmittedMessage &&
    messages.length === 0 &&
    !hasDoneAutoPrompt.current;

  const connectedWalletsMeta: WalletMeta[] = connectedWallets.map((x) => ({
    address: x.getAccount()?.address || "",
    walletId: x.id,
  }));

  const handleSetActiveWallet = (walletMeta: WalletMeta) => {
    const wallet = connectedWallets.find(
      (x) => x.getAccount()?.address === walletMeta.address,
    );
    if (wallet) {
      setActiveWallet(wallet);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <WalletDisconnectedDialog
        onOpenChange={setShowConnectModal}
        open={showConnectModal}
      />

      {showEmptyState ? (
        <div className="flex h-full flex-col">
          {/* Empty state content - scrollable area */}
          <div className="flex-1 overflow-y-auto">
            <div className="fade-in-0 container flex max-w-[800px] min-h-full animate-in flex-col justify-center">
              <EmptyStateChatPageContent
                connectedWallets={connectedWalletsMeta}
                context={contextFilters}
                isConnectingWallet={connectionStatus === "connecting"}
                sendMessage={handleSendMessage}
                setActiveWallet={handleSetActiveWallet}
                setContext={setContextFilters}
              />
            </div>
          </div>

          {/* Chat input - anchored at bottom (same as chat state) */}
          <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-[800px] py-4">
              <ContextOptionsBar
                walletAddress={userWalletAddress}
                chainIds={userChainIds}
                autoExecute={userAutoExecute}
                onWalletAddressChange={setUserWalletAddress}
                onChainIdsChange={setUserChainIds}
                onAutoExecuteChange={setUserAutoExecute}
              />
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
                placeholder="Ask thirdweb AI"
                sendMessage={handleSendMessage}
                setActiveWallet={handleSetActiveWallet}
                setContext={(v) => {
                  setContextFilters(v);
                }}
              />

              {/* Footer disclaimer */}
              <p className="flex items-center justify-center gap-1 mt-3 text-center text-muted-foreground hover:text-foreground text-xs opacity-75 lg:text-sm">
                <Link
                  href="https://portal.thirdweb.com/ai/chat"
                  target="_blank"
                >
                  Learn how to integrate thirdweb AI into your apps
                </Link>
                <ExternalLinkIcon className="size-3" />
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          {/* Chat messages area - scrollable */}
          <div className="flex-1 overflow-y-auto">
            {messages.length > 0 && (
              <SimpleChats
                className="min-w-0"
                client={props.client}
                enableAutoScroll={enableAutoScroll}
                isChatStreaming={isChatStreaming}
                messages={messages}
                sendMessage={handleSendMessage}
                setEnableAutoScroll={setEnableAutoScroll}
              />
            )}
          </div>

          {/* Chat input - anchored at bottom */}
          <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-[800px] py-4">
              <ContextOptionsBar
                walletAddress={userWalletAddress}
                chainIds={userChainIds}
                autoExecute={userAutoExecute}
                onWalletAddressChange={setUserWalletAddress}
                onChainIdsChange={setUserChainIds}
                onAutoExecuteChange={setUserAutoExecute}
              />
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
                placeholder="Ask thirdweb AI"
                sendMessage={handleSendMessage}
                setActiveWallet={handleSetActiveWallet}
                setContext={(v) => {
                  setContextFilters(v);
                }}
              />

              {/* Footer disclaimer */}
              <p className="flex items-center justify-center gap-1 mt-3 text-center text-muted-foreground hover:text-foreground text-xs opacity-75 lg:text-sm">
                <Link
                  href="https://portal.thirdweb.com/ai/chat"
                  target="_blank"
                >
                  Learn how to integrate thirdweb AI into your apps
                </Link>
                <ExternalLinkIcon className="size-3" />
              </p>
            </div>
          </div>
        </div>
      )}
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
            <MessageCircleIcon className="size-8 text-muted-foreground" />
          </div>
        </div>
        <div className="h-5" />
        <h1 className="px-4 text-center font-semibold text-3xl tracking-tight md:text-4xl">
          thirdweb AI demo
        </h1>
        <div className="h-8" />
        <div className="mx-auto max-w-[600px]">
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
          className="min-h-[60px] w-full resize-none border-none bg-transparent p-2 leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
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
              disabled={message.trim() === "" || props.isConnectingWallet}
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
  className?: string;
  client: ThirdwebClient;
  setEnableAutoScroll: (enable: boolean) => void;
  enableAutoScroll: boolean;
  sendMessage: (message: NebulaUserMessage) => void;
}) {
  const { messages, enableAutoScroll } = props;
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
    <div className="container max-w-[800px]">
      <div className={`flex flex-col gap-5 py-6 pb-8 ${props.className}`}>
        {props.messages.map((message, index) => {
          const isMessagePending =
            props.isChatStreaming && index === props.messages.length - 1;

          return (
            <div
              className="fade-in-0 min-w-0 animate-in pt-1 text-sm duration-300 lg:text-base"
              key={`${index}-${message}`}
            >
              <RenderMessage
                isMessagePending={isMessagePending}
                message={message}
                sendMessage={props.sendMessage}
              />
            </div>
          );
        })}
        <div ref={scrollAnchorRef} />
      </div>
    </div>
  );
}

function RenderMessage(props: {
  message: ChatMessage;
  isMessagePending: boolean;
  sendMessage: (message: NebulaUserMessage) => void;
}) {
  const { message } = props;
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  if (props.message.type === "user") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        {props.message.content.map((msg, index) => {
          if (msg.type === "text") {
            return (
              <div
                className="flex justify-end"
                key={`${index}-${msg.text}-${msg.type}`}
              >
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
          {props.isMessagePending ? (
            <Spinner />
          ) : (
            <MessageCircleIcon className="size-5 text-muted-foreground" />
          )}
        </div>
      </div>

      <div className="min-w-0 grow">
        <div className="rounded-lg">
          {message.type === "assistant" && (
            <div className="prose prose-sm max-w-none">
              <MarkdownRenderer
                markdownText={message.text}
                p={{ className: "mb-4 text-foreground leading-loose" }}
                code={{ className: "rounded-lg" }}
                inlineCode={{ className: "bg-muted/80" }}
              />
            </div>
          )}

          {message.type === "image" && (
            <div className="flex justify-end" key={message.data.url}>
              <Img
                src={resolveSchemeWithErrorHandler({
                  client: THIRDWEB_CLIENT,
                  uri: message.data.url,
                })}
                width={message.data.width}
                height={message.data.height}
              />
            </div>
          )}

          {message.type === "action" &&
            message.subtype === "sign_transaction" && (
              <div className="flex justify-end" key={message.request_id}>
                {wallet && account ? (
                  <div className="flex items-center gap-4">
                    <WalletProvider id={wallet.id}>
                      <WalletIcon className="size-6" />
                    </WalletProvider>

                    <TransactionButton
                      transaction={() =>
                        prepareTransaction({
                          client: THIRDWEB_CLIENT,
                          chain: defineChain(message.data.chain_id),
                          data: message.data.data,
                          to: message.data.to,
                          value: message.data.value
                            ? BigInt(message.data.value)
                            : undefined,
                        })
                      }
                      onError={(error) => {
                        alert(error.message);
                        console.error(error);
                      }}
                      onTransactionSent={(tx) => {
                        props.sendMessage({
                          content: [
                            {
                              chain_id: message.data.chain_id,
                              transaction_hash: tx.transactionHash,
                              type: "transaction",
                            },
                          ],
                          role: "user",
                        });
                      }}
                    >
                      Execute Transaction
                    </TransactionButton>
                  </div>
                ) : (
                  <ConnectButton
                    client={THIRDWEB_CLIENT}
                    chain={defineChain(message.data.chain_id)}
                  />
                )}
              </div>
            )}

          {message.type === "action" && message.subtype === "sign_swap" && (
            <div className="flex justify-end" key={message.request_id}>
              {wallet && account ? (
                <div className="flex items-center gap-4">
                  <WalletProvider id={wallet.id}>
                    <WalletIcon className="size-6" />
                  </WalletProvider>

                  <TransactionButton
                    transaction={() =>
                      prepareTransaction({
                        client: THIRDWEB_CLIENT,
                        chain: defineChain(message.data.transaction.chain_id),
                        data: message.data.transaction.data,
                        to: message.data.transaction.to,
                        value: message.data.transaction.value
                          ? BigInt(message.data.transaction.value)
                          : undefined,
                      })
                    }
                    onError={(error) => {
                      alert(error.message);
                      console.error(error);
                    }}
                    onTransactionSent={(tx) => {
                      props.sendMessage({
                        content: [
                          {
                            chain_id: message.data.transaction.chain_id,
                            transaction_hash: tx.transactionHash,
                            type: "transaction",
                          },
                        ],
                        role: "user",
                      });
                    }}
                  >
                    {message.data.action === "approval"
                      ? "Approve"
                      : "Execute Swap"}
                  </TransactionButton>
                </div>
              ) : (
                <ConnectButton
                  client={THIRDWEB_CLIENT}
                  chain={defineChain(message.data.transaction.chain_id)}
                />
              )}
            </div>
          )}

          {message.type === "presence" && (
            <div className="text-muted-foreground text-sm italic flex items-center gap-2">
              {message.texts[message.texts.length - 1]}
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

function ContextOptionsBar(props: {
  walletAddress: string;
  chainIds: string;
  autoExecute: boolean;
  onWalletAddressChange: (value: string) => void;
  onChainIdsChange: (value: string) => void;
  onAutoExecuteChange: (value: boolean) => void;
}) {
  return (
    <div className="mb-4 rounded-lg border bg-card p-3">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="wallet-address" className="text-sm font-medium text-muted-foreground">
            Wallet Address:
          </label>
          <input
            id="wallet-address"
            type="text"
            value={props.walletAddress}
            onChange={(e) => props.onWalletAddressChange(e.target.value)}
            placeholder="0x..."
            className="px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring bg-background"
            style={{ width: "200px" }}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="chain-ids" className="text-sm font-medium text-muted-foreground">
            Chain IDs:
          </label>
          <input
            id="chain-ids"
            type="text"
            value={props.chainIds}
            onChange={(e) => props.onChainIdsChange(e.target.value)}
            placeholder="1, 8453"
            className="px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring bg-background"
            style={{ width: "100px" }}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input
            id="auto-execute"
            type="checkbox"
            checked={props.autoExecute}
            onChange={(e) => props.onAutoExecuteChange(e.target.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
          />
          <label htmlFor="auto-execute" className="text-sm font-medium text-muted-foreground">
            Auto Execute Transactions
          </label>
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
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  contextFilters: NebulaContext | undefined;
  setContextFilters: (v: NebulaContext | undefined) => void;
}) {
  const {
    abortController,
    message,
    setMessages,
    contextFilters,
    setContextFilters,
  } = params;
  let requestIdForMessage = "";
  let hasReceivedResponse = false;

  await promptNebula({
    abortController,
    context: contextFilters,
    handleStream(res) {
      if (abortController.signal.aborted) {
        return;
      }

      switch (res.event) {
        case "init": {
          requestIdForMessage = res.data.request_id;
          setContextFilters({
            chainIds: contextFilters?.chainIds || [],
            sessionId: res.data.session_id,
            walletAddress: contextFilters?.walletAddress || null,
          });
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
            sessionId: res.data.session_id,
            walletAddress: res.data.wallet_address,
          });
          return;
        }

        case "action": {
          hasReceivedResponse = true;
          switch (res.type) {
            case "sign_transaction": {
              setMessages((prevMessages) => {
                return [
                  ...prevMessages,
                  {
                    data: res.data,
                    request_id: res.request_id,
                    subtype: res.type,
                    type: "action",
                  },
                ];
              });
              return;
            }
            case "sign_swap": {
              setMessages((prevMessages) => {
                return [
                  ...prevMessages,
                  {
                    data: res.data,
                    request_id: res.request_id,
                    subtype: res.type,
                    type: "action",
                  },
                ];
              });
              return;
            }
          }
          return;
        }

        case "image": {
          hasReceivedResponse = true;
          setMessages((prevMessages) => {
            return [
              ...prevMessages,
              {
                data: res.data,
                request_id: res.request_id,
                type: "image",
              },
            ];
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
