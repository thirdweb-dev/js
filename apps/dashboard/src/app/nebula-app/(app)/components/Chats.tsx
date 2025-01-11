import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Account as TWAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircleIcon,
  CheckIcon,
  CopyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type ThirdwebClient, prepareTransaction } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { TransactionButton } from "../../../../components/buttons/TransactionButton";
import { MarkdownRenderer } from "../../../../components/contract-components/published-contract/markdown-renderer";
import { useV5DashboardChain } from "../../../../lib/v5-adapter";
import { getSDKTheme } from "../../../components/sdk-component-theme";
import { submitFeedback } from "../api/feedback";
import { NebulaIcon } from "../icons/NebulaIcon";

export type NebulaTxData = {
  chainId: number;
  data: `0x${string}`;
  to: string;
  value: string;
};

export type ChatMessage =
  | {
      text: string;
      type: "user" | "error" | "presence";
    }
  | {
      // assistant type message loaded from history doesn't have request_id
      request_id: string | undefined;
      text: string;
      type: "assistant";
    }
  | {
      type: "send_transaction";
      data: NebulaTxData | null;
    };

export function Chats(props: {
  messages: Array<ChatMessage>;
  isChatStreaming: boolean;
  authToken: string;
  sessionId: string | undefined;
  className?: string;
  twAccount: TWAccount;
  client: ThirdwebClient;
  setEnableAutoScroll: (enable: boolean) => void;
  enableAutoScroll: boolean;
}) {
  const { messages, setEnableAutoScroll, enableAutoScroll } = props;
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // auto scroll to bottom when messages change
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!enableAutoScroll || messages.length === 0) {
      return;
    }

    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, enableAutoScroll]);

  // stop auto scrolling when user interacts with chat
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!enableAutoScroll) {
      return;
    }

    const chatScrollContainer =
      chatContainerRef.current?.querySelector("[data-scrollable]");

    if (!chatScrollContainer) {
      return;
    }

    const disableScroll = () => {
      setEnableAutoScroll(false);
      chatScrollContainer.removeEventListener("mousedown", disableScroll);
      chatScrollContainer.removeEventListener("wheel", disableScroll);
    };

    chatScrollContainer.addEventListener("mousedown", disableScroll);
    chatScrollContainer.addEventListener("wheel", disableScroll);
  }, [setEnableAutoScroll, enableAutoScroll]);

  return (
    <div
      className="relative flex max-h-full flex-1 flex-col overflow-hidden"
      ref={chatContainerRef}
    >
      <ScrollShadow
        className="flex-1"
        scrollableClassName="max-h-full"
        shadowColor="hsl(var(--background))"
        shadowClassName="z-[1]"
      >
        <div className="container max-w-[800px]">
          <div className={cn("flex flex-col gap-5 py-4", props.className)}>
            {props.messages.map((message, index) => {
              const isMessagePending =
                props.isChatStreaming && index === props.messages.length - 1;
              return (
                <div
                  className="fade-in-0 min-w-0 animate-in pt-1 text-sm duration-300 lg:text-base"
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique key
                  key={index}
                >
                  {message.type === "user" ? (
                    <div className="flex justify-end gap-3">
                      <div className="max-w-[80%] overflow-auto rounded-xl border bg-muted/50 px-4 py-2">
                        <MarkdownRenderer
                          skipHtml
                          markdownText={message.text}
                          code={{
                            ignoreFormattingErrors: true,
                            className: "bg-transparent",
                          }}
                          className="text-foreground [&>*:last-child]:mb-0"
                          p={{ className: "text-foreground leading-normal" }}
                          li={{ className: "text-foreground" }}
                          inlineCode={{ className: "border-none" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      {/* Left Icon */}
                      <div className="-translate-y-[2px] relative shrink-0">
                        <div
                          className={cn(
                            "flex size-9 items-center justify-center rounded-full",
                            message.type === "assistant" &&
                              "border bg-muted/50",
                            message.type === "error" && "border",
                            message.type === "presence" && "border bg-muted/50",
                          )}
                        >
                          {message.type === "presence" && (
                            <Spinner className="size-4" />
                          )}

                          {message.type === "assistant" && (
                            <NebulaIcon className="size-5 text-muted-foreground" />
                          )}

                          {message.type === "error" && (
                            <AlertCircleIcon className="size-5 text-destructive-text" />
                          )}
                        </div>
                      </div>

                      {/* Right Message */}
                      <div className="min-w-0 grow">
                        <ScrollShadow className="rounded-lg">
                          {message.type === "assistant" ? (
                            <MarkdownRenderer
                              skipHtml
                              markdownText={message.text}
                              code={{
                                disableCodeHighlight: isMessagePending,
                                ignoreFormattingErrors: true,
                              }}
                              className="text-foreground [&>*:last-child]:mb-0"
                              p={{
                                className: "text-foreground",
                              }}
                              li={{ className: "text-foreground" }}
                            />
                          ) : message.type === "error" ? (
                            <span className="text-destructive-text leading-loose">
                              {message.text}
                            </span>
                          ) : message.type === "send_transaction" ? (
                            <ExecuteTransaction
                              txData={message.data}
                              twAccount={props.twAccount}
                              client={props.client}
                            />
                          ) : (
                            <span className="leading-loose">
                              {message.text}
                            </span>
                          )}
                        </ScrollShadow>

                        {message.type === "assistant" &&
                          !props.isChatStreaming &&
                          props.sessionId &&
                          message.request_id && (
                            <MessageActions
                              messageText={message.text}
                              authToken={props.authToken}
                              requestId={message.request_id}
                              sessionId={props.sessionId}
                              className="mt-4"
                            />
                          )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={scrollAnchorRef} />
          </div>
        </div>
      </ScrollShadow>
    </div>
  );
}

function ExecuteTransaction(props: {
  txData: NebulaTxData | null;
  twAccount: TWAccount;
  client: ThirdwebClient;
}) {
  if (!props.txData) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="size-5" />
        <AlertTitle>Failed to parse transaction data</AlertTitle>
      </Alert>
    );
  }

  return (
    <SendTransactionButton
      txData={props.txData}
      twAccount={props.twAccount}
      client={props.client}
    />
  );
}

function MessageActions(props: {
  authToken: string;
  requestId: string;
  sessionId: string;
  messageText: string;
  className?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  function sendRating(rating: "good" | "bad") {
    return submitFeedback({
      authToken: props.authToken,
      rating,
      requestId: props.requestId,
      sessionId: props.sessionId,
    });
  }
  const sendPositiveRating = useMutation({
    mutationFn: () => sendRating("good"),
    onSuccess() {
      toast.info("Thanks for the feedback!");
    },
    onError() {
      toast.error("Failed to send feedback");
    },
  });

  const sendBadRating = useMutation({
    mutationFn: () => sendRating("bad"),
    onSuccess() {
      toast.info("Thanks for the feedback!");
    },
    onError() {
      toast.error("Failed to send feedback");
    },
  });

  return (
    <div
      className={cn("flex items-center gap-2 text-foreground", props.className)}
    >
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-2 rounded-lg text-sm"
        onClick={() => {
          navigator.clipboard.writeText(props.messageText);
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1000);
        }}
      >
        {isCopied ? (
          <CheckIcon className="size-3.5 text-green-500" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
        Copy
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="size-8 rounded-lg p-0"
        onClick={() => {
          sendPositiveRating.mutate();
        }}
      >
        {sendPositiveRating.isPending ? (
          <Spinner className="size-4" />
        ) : (
          <ThumbsUpIcon className="size-4" />
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="size-8 rounded-lg p-0"
        onClick={() => {
          sendBadRating.mutate();
        }}
      >
        {sendBadRating.isPending ? (
          <Spinner className="size-4" />
        ) : (
          <ThumbsDownIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

function SendTransactionButton(props: {
  txData: NebulaTxData;
  twAccount: TWAccount;
  client: ThirdwebClient;
}) {
  const { theme } = useTheme();
  const { txData } = props;
  const sendTransaction = useSendTransaction({
    payModal: {
      theme: getSDKTheme(theme === "light" ? "light" : "dark"),
    },
  });
  const chain = useV5DashboardChain(txData.chainId);

  return (
    <TransactionButton
      isPending={sendTransaction.isPending}
      transactionCount={1}
      txChainID={txData.chainId}
      onClick={() => {
        const tx = prepareTransaction({
          chain: chain,
          client: props.client,
          data: txData.data,
          to: txData.to,
          value: BigInt(txData.value),
        });

        const promise = sendTransaction.mutateAsync(tx);

        toast.promise(promise, {
          success: "Transaction sent successfully",
          error: "Failed to send transaction",
        });
      }}
      className="gap-2"
      twAccount={props.twAccount}
    >
      Execute Transaction
    </TransactionButton>
  );
}
