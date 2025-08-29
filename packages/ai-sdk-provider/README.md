# thirdweb AI SDK Provider

A [Vercel AI SDK](https://ai-sdk.dev/docs/introduction) provider that integrates thirdweb's blockchain AI capabilities into your applications. Build AI agents and chat UIs that can interact with smart contracts, execute transactions, and perform swaps directly from AI responses.

## Features

- **Blockchain-aware AI**: AI models that understand and can interact with blockchain data
- **Transaction execution**: Sign and execute transactions directly from AI responses
- **Token swaps**: Perform token swaps through AI-generated actions
- **Transaction monitoring**: Track transaction status and confirmations
- **Session continuity**: Maintain conversation context across interactions
- **Type safety**: Full TypeScript support with typed tool results
- **Streaming support**: Real-time AI responses with reasoning steps

## Installation

```bash
npm install @thirdweb-dev/ai-sdk-provider ai @ai-sdk/react
```

## Usage

### Server Setup (Next.js App Router)

Create an API route to handle AI chat requests:

```ts
// app/api/chat/route.ts
import { convertToModelMessages, streamText } from "ai";
import { createThirdwebAI } from "@thirdweb-dev/ai-sdk-provider";

// Allow streaming responses up to 5 minutes
export const maxDuration = 300;

const thirdwebAI = createThirdwebAI({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();

  const result = streamText({
    model: thirdwebAI.chat({
      context: {
        session_id: sessionId, // session id for continuity
        chain_ids: [8453], // optional chain ids
        from: "0x...", // optional from address
        auto_execute_transactions: false, // optional, defaults to false
      },
    }),
    messages: convertToModelMessages(messages),
    tools: thirdwebAI.tools(), // optional, enables transaction and swap tools
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true, // optional, sends reasoning steps to client
    messageMetadata({ part }) {
      // record session id for continuity
      if (part.type === "finish-step") {
        return {
          session_id: part.response.id,
        };
      }
    },
  });
}
```

### Client Setup (React)

Use the `useChat` hook with thirdweb message types:

```tsx
"use client";

import { useState } from "react";
import { useChat, DefaultChatTransport } from "@ai-sdk/react";
import type { ThirdwebAiMessage } from "@thirdweb-dev/ai-sdk-provider";

export function Chat() {
  const [sessionId, setSessionId] = useState("");

  const { messages, sendMessage, addToolResult, status } =
    useChat<ThirdwebAiMessage>({
      transport: new DefaultChatTransport({ api: "/api/chat" }),
      onFinish: ({ message }) => {
        // save session id for continuity
        setSessionId(message.metadata?.session_id ?? "");
      },
    });

  const send = (message: string) => {
    sendMessage(
      { text: message },
      {
        body: {
          // send session id for continuity
          sessionId,
        },
      }
    );
  };

  return (
    <>
      {messages.map((message) => (
        <RenderMessage
          key={message.id}
          message={message}
          sessionId={sessionId}
          addToolResult={addToolResult}
          send={send}
        />
      ))}
      <ChatInputBox send={send} />
    </>
  );
}
```

### Handling Tool Results

Render different message types and handle blockchain actions:

```tsx
import { TransactionButton } from "thirdweb/react";
import { prepareTransaction } from "thirdweb";
import type { ThirdwebAiMessage } from "@thirdweb-dev/ai-sdk-provider";

export function RenderMessage(props: {
  message: ThirdwebAiMessage;
  sessionId: string;
  addToolResult: (toolResult: any) => void;
  send: (message: string) => void;
}) {
  const { message, sessionId, addToolResult, send } = props;

  return (
    <>
      {message.parts.map((part, i) => {
        switch (part.type) {
          case "text":
            return <div key={i}>{part.text}</div>;

          case "reasoning":
            return (
              <div key={i} className="reasoning">
                {part.text}
              </div>
            );

          case "tool-sign_transaction":
            // example of how to handle transaction confirmations
            const transactionData = part.input;
            return (
              <TransactionButton
                key={i}
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
                  // add the tool result to continue conversation
                  addToolResult({
                    tool: "sign_transaction",
                    toolCallId: part.toolCallId,
                    output: {
                      transaction_hash: transaction.transactionHash,
                      chain_id: transaction.chain.id,
                    },
                  });

                  // continue the conversation with tool result
                  send("");
                }}
                onError={(error) => {
                  send(`Transaction failed: ${error.message}`);
                }}
              >
                Execute Transaction
              </TransactionButton>
            );

          case "tool-sign_swap":
            return <SwapButton key={i} input={part.input} />;

          case "tool-monitor_transaction":
            return <TransactionMonitor key={i} input={part.input} />;

          default:
            return null;
        }
      })}
    </>
  );
}
```

## Configuration

### ThirdwebConfig

```ts
interface ThirdwebConfig {
  /** Base URL of the thirdweb API (defaults to https://api.thirdweb.com) */
  baseURL?: string;
  /** Project secret key for backend usage */
  secretKey?: string;
  /** Project client ID for frontend usage */
  clientId?: string;
  /** User wallet auth token (JWT) for executing transactions */
  walletAuthToken?: string;
}
```

### ThirdwebSettings

```ts
interface ThirdwebSettings {
  context?: {
    /** Whether to automatically execute transactions (defaults to false) */
    auto_execute_transactions?: boolean;
    /** Default chain IDs for queries and transactions */
    chain_ids?: number[];
    /** From address to execute transactions from */
    from?: string;
    /** Session ID for conversation continuity */
    session_id?: string | null;
  };
}
```

## Available Tools

The provider includes three built-in tools:

- **`sign_transaction`**: Sign and execute blockchain transactions
- **`sign_swap`**: Perform token swaps
- **`monitor_transaction`**: Track transaction status and confirmations

## Resources

- **Playground**: [https://playground.thirdweb.com/ai/chat/ai-sdk](https://playground.thirdweb.com/ai/chat/ai-sdk)
- **Documentation**: [https://portal.thirdweb.com/ai/chat/ai-sdk](https://portal.thirdweb.com/ai/chat/ai-sdk)
- **Vercel AI SDK**: [https://ai-sdk.dev/docs/introduction](https://ai-sdk.dev/docs/introduction)

## License

Apache-2.0
