"use client";

import { type UseChatHelpers, useChat } from "@ai-sdk/react";
import type { ThirdwebAiMessage } from "@thirdweb-dev/ai-sdk-provider";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useMemo, useState } from "react";
import { defineChain, prepareTransaction } from "thirdweb";
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
} from "thirdweb/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/conversation";
import { Message, MessageContent } from "@/components/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/reasoning";
import { Response } from "@/components/response";
import { Loader } from "../../../../components/loader";
import { THIRDWEB_CLIENT } from "../../../../lib/client";

export function ChatContainer() {
  const { messages, sendMessage, status, addToolResult } =
    useChat<ThirdwebAiMessage>({
      transport: new DefaultChatTransport({
        api: "/api/chat",
      }),
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    });
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full">
      <div className="flex flex-col h-[600px]  rounded-lg border">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 && (
              <div className="h-[300px] flex items-center justify-center text-center text-muted-foreground">
                Type a message to start the conversation
              </div>
            )}
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      case "reasoning":
                        return (
                          <Reasoning
                            key={`${message.id}-reasoning-${i}`}
                            className="w-full max-w-md"
                            isStreaming={status === "streaming"}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent className="text-xs text-muted-foreground italic flex flex-col gap-2">
                              {part.text}
                            </ReasoningContent>
                          </Reasoning>
                        );
                      case "tool-sign_transaction":
                        return (
                          <SignTransactionButton
                            key={`${message.id}-transaction-${i}`}
                            input={part.input}
                            addToolResult={addToolResult}
                            sendMessage={sendMessage}
                            toolCallId={part.toolCallId}
                          />
                        );
                      case "tool-sign_swap":
                        console.log("---sign_swap", part);
                        return (
                          <SignSwapButton
                            key={`${message.id}-swap-${i}`}
                            input={part.input}
                            addToolResult={addToolResult}
                            sendMessage={sendMessage}
                            toolCallId={part.toolCallId}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative border-x-0 border-b-0 rounded-t-none"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === "streaming" ? "streaming" : "ready"}
            disabled={!input.trim()}
            className="absolute top-4 right-4"
          />
        </PromptInput>
      </div>
    </div>
  );
}

type SignTransactionButtonProps = {
  input:
    | Extract<
        ReturnType<
          typeof useChat<ThirdwebAiMessage>
        >["messages"][number]["parts"][number],
        { type: "tool-sign_transaction" }
      >["input"]
    | undefined;
  addToolResult: UseChatHelpers<ThirdwebAiMessage>["addToolResult"];
  sendMessage: UseChatHelpers<ThirdwebAiMessage>["sendMessage"];
  toolCallId: string;
};

const SignTransactionButton = (props: SignTransactionButtonProps) => {
  const { input, addToolResult, toolCallId, sendMessage } = props;
  const transactionData: {
    chain_id: number;
    to: string;
    data: `0x${string}`;
    value: bigint;
  } = useMemo(() => {
    return {
      chain_id: input?.chain_id || 8453,
      to: input?.to || "",
      data: (input?.data as `0x${string}`) || "0x",
      value: input?.value ? BigInt(input.value) : BigInt(0),
    };
  }, [input]);
  const account = useActiveAccount();

  if (!account) {
    return <ConnectButton client={THIRDWEB_CLIENT} />;
  }

  return (
    <div className="py-4">
      <TransactionButton
        style={{
          width: "100%",
        }}
        transaction={() =>
          prepareTransaction({
            client: THIRDWEB_CLIENT,
            chain: defineChain(transactionData.chain_id),
            to: transactionData.to,
            data: transactionData.data,
            value: transactionData.value,
          })
        }
        onTransactionSent={(transaction) => {
          addToolResult({
            tool: "sign_transaction",
            toolCallId,
            output: {
              transaction_hash: transaction.transactionHash,
              chain_id: transaction.chain.id,
            },
          });
        }}
        onError={(error) => {
          sendMessage({ text: `Transaction failed: ${error.message}` });
        }}
      >
        Sign Transaction
      </TransactionButton>
    </div>
  );
};

type SignSwapButtonProps = {
  input:
    | Extract<
        ReturnType<
          typeof useChat<ThirdwebAiMessage>
        >["messages"][number]["parts"][number],
        { type: "tool-sign_swap" }
      >["input"]
    | undefined;
  addToolResult: UseChatHelpers<ThirdwebAiMessage>["addToolResult"];
  sendMessage: UseChatHelpers<ThirdwebAiMessage>["sendMessage"];
  toolCallId: string;
};
const SignSwapButton = (props: SignSwapButtonProps) => {
  const { input, addToolResult, toolCallId, sendMessage } = props;
  const transactionData: {
    chain_id: number;
    to: string;
    data: `0x${string}`;
    value: bigint;
  } = useMemo(() => {
    return {
      chain_id: input?.transaction?.chain_id || 8453,
      to: input?.transaction?.to || "",
      data: (input?.transaction?.data as `0x${string}`) || "0x",
      value: input?.transaction?.value
        ? BigInt(input.transaction.value)
        : BigInt(0),
    };
  }, [input]);
  const account = useActiveAccount();

  if (!account) {
    return <ConnectButton client={THIRDWEB_CLIENT} />;
  }

  return (
    <div className="py-4">
      <TransactionButton
        style={{
          width: "100%",
        }}
        transaction={() =>
          prepareTransaction({
            client: THIRDWEB_CLIENT,
            chain: defineChain(transactionData.chain_id),
            to: transactionData.to,
            data: transactionData.data,
            value: transactionData.value,
          })
        }
        onTransactionSent={(transaction) => {
          addToolResult({
            tool: "sign_swap",
            toolCallId,
            output: {
              transaction_hash: transaction.transactionHash,
              chain_id: transaction.chain.id,
            },
          });
        }}
        onError={(error) => {
          sendMessage({ text: `Transaction failed: ${error.message}` });
        }}
      >
        Sign swap
      </TransactionButton>
    </div>
  );
};
