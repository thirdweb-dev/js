import { CodeServer } from "@workspace/ui/components/code/code.server";
import { BotIcon, Code2Icon } from "lucide-react";
import { CodeExample, TabName } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { createMetadata } from "../../../lib/metadata";
import { ChatContainer } from "./components/chat-container";

const title = "AI SDK Integration";
const description =
  "Use the thirdweb blockchain models with the Vercel AI SDK to build AI agents and UIs that can interact with your contracts and wallets.";

const ogDescription =
  "Use the thirdweb blockchain models with the Vercel AI SDK to build AI agents and UIs that can interact with your contracts and wallets.";

export const metadata = createMetadata({
  title,
  description: ogDescription,
  image: {
    icon: "contract",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={BotIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/ai/chat/ai-sdk?utm_source=playground"
      >
        <ChatExample />
        <div className="h-8" />
        <ServerCodeExample />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function ServerCodeExample() {
  return (
    <>
      <div className="mb-4">
        <h2 className="font-semibold text-xl tracking-tight">
          Next.js Server Code Example
        </h2>
        <p className="max-w-4xl text-muted-foreground text-balance text-sm md:text-base">
          The server code is responsible for handling the chat requests and
          streaming the responses to the client.
        </p>
      </div>
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex grow flex-col border-b md:border-r md:border-b-0">
          <TabName icon={Code2Icon} name="Server Code" />
          <CodeServer
            className="h-full rounded-none border-none"
            code={`// src/app/api/chat/route.ts

        import { convertToModelMessages, streamText } from "ai";
import { createThirdwebAI } from "@thirdweb-dev/ai-sdk-provider";

// Allow streaming responses up to 5 minutes
export const maxDuration = 300;

const thirdwebAI = createThirdwebAI({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

export async function POST(req: Request) {
  const { messages, id } = await req.json();
  const result = streamText({
    model: thirdwebAI.chat(id, {
      context: {
        chain_ids: [8453], // optional chain ids
        from: "0x...", // optional from address
        auto_execute_transactions: true, // optional, defaults to false
      },
    }),
    messages: convertToModelMessages(messages),
    tools: thirdwebAI.tools(), // optional, to use handle transactions and swaps
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true, // optional, to send reasoning steps to the client
  });
}

      `}
            lang="tsx"
          />
        </div>
      </div>
    </>
  );
}

function ChatExample() {
  return (
    <CodeExample
      header={{
        title: "Client Code Example",
        description:
          "Use the Vercel AI React SDK to build a chat UI that can interact with the server code.",
      }}
      code={`'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { ThirdwebAiMessage } from '@thirdweb-dev/ai-sdk-provider';

export default function Page() {
  const { messages, sendMessage } = useChat<ThirdwebAiMessage>({
    transport: new DefaultChatTransport({
      // see server implementation below
      api: '/api/chat',
    }),
  });

  return (
    <>
      {messages.map(message => (
        <RenderMessage message={message} />
      ))}
      <ChatInputBox send={sendMessage} />
    </>
  );
}`}
      lang="tsx"
      preview={<ChatContainer />}
    />
  );
}
