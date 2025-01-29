import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NebulaIcon } from "app/nebula-app/(app)/icons/NebulaIcon";
import { MarkdownRenderer } from "components/contract-components/published-contract/markdown-renderer";
import { SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { stringify } from "thirdweb/utils";
import { createNebulaSesssion } from "../actions/createNebulaSession";
import { sendNebulaMessage } from "../actions/sendNebulaMessage";
import type { TokenDetails } from "../hooks/useGetERC20Tokens";
import type { NFTDetails } from "../hooks/useGetNFTs";

interface NebulaInterfaceProps {
  chainId: number;
  address: string;
  transactions: any;
  contracts: any;
  tokens: TokenDetails[];
  nfts: NFTDetails[];
}

const getSessionStorageKey = (chainId: number, address: string) =>
  `nebula_session:wallet:${chainId}:${address}`;

// Modify the session creation logic
const getOrCreateSession = async (chainId: number, address: string) => {
  const storageKey = getSessionStorageKey(chainId, address);
  const existingSession = localStorage.getItem(storageKey);

  if (existingSession) {
    console.log(`Using existing session ${existingSession}.`);
    return existingSession;
  }

  const sessionId = await createNebulaSesssion({ address, chainId });

  localStorage.setItem(storageKey, sessionId);
  console.log(`Created new session ${sessionId}.`);
  return sessionId;
};

export function NebulaInterface({
  chainId,
  address,
  tokens,
  nfts,
}: NebulaInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ text: string; timestamp: number; isUser: boolean }>
  >([]);
  const [sessionId, setSessionId] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [messagesHeight, setMessagesHeight] = useState(320);

  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    const startY = e.clientY;
    const startHeight = messagesHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      setMessagesHeight(Math.max(200, startHeight + deltaY));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    (async () => {
      setIsWaitingForResponse(true);
      try {
        setSessionId(await getOrCreateSession(chainId, address));

        const initMessage = [
          `My wallet address on chain ${chainId} is ${address}.`,
          "Please update your knowledge base with the following information:",
          `I have ${tokens.length} tokens: ${stringify(tokens)}`,
          `I have ${nfts.length} NFTs: ${stringify(nfts)}`,
          "Answer these questions:",
          "Give me a 3 sentence summary of my wallet.",
          "Give me a list of notable NFTs and ERC20 tokens in my wallet.",
          "Give me an overview of recent activity in my wallet in the last 30 days.",
        ].join("\n");

        const initResponse = await sendNebulaMessage({
          sessionId,
          message: initMessage,
        });

        setMessages([
          {
            text: initResponse.message,
            timestamp: Date.now(),
            isUser: false,
          },
        ]);
      } catch (e) {
        console.error("Error creating Nebula session:", e);
      } finally {
        setIsWaitingForResponse(false);
      }
    })();
  }, [address, chainId, tokens, nfts, sessionId]);

  function displayNewChatMessageOrResponse(
    args: { userMessage: string } | { nebulaResponse: string },
  ) {
    setMessage("");

    const message =
      "userMessage" in args
        ? { text: args.userMessage, timestamp: Date.now(), isUser: true }
        : { text: args.nebulaResponse, timestamp: Date.now(), isUser: false };
    setMessages((prev) => [...prev, message]);

    setTimeout(() => {
      const messagesDiv = document.getElementById("nebula-messages");
      if (messagesDiv) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    }, 0);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message) return;

    try {
      displayNewChatMessageOrResponse({ userMessage: message });
      setIsWaitingForResponse(true);

      const response = await sendNebulaMessage({ sessionId, message });
      displayNewChatMessageOrResponse({ nebulaResponse: response.message });
    } catch (e) {
      console.error("Error sending Nebula message:", e);
    } finally {
      setIsWaitingForResponse(false);
    }
  }

  return (
    <div className="flex flex-col">
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 rounded-lg border bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),rgba(147,51,234,0.2))]" />

        {/* Messages */}
        <div
          id="nebula-messages"
          className="space-y-4 overflow-y-auto p-4"
          style={{ height: messagesHeight }}
        >
          {messages.map((msg) => (
            <div
              key={msg.timestamp}
              className={`${
                msg.isUser ? "ml-auto bg-blue-500" : "bg-gray-700"
              } max-w-[80%] rounded-lg px-4 py-2 text-sm`}
            >
              <div className="relative flex gap-3 overflow-x-auto border-red-500">
                {!msg.isUser && (
                  <NebulaIcon className="absolute top-2 right-0 size-4 opacity-50" />
                )}
                <MarkdownRenderer
                  markdownText={msg.text}
                  p={{
                    className: msg.isUser
                      ? "text-bold text-gray-800"
                      : "text-gray-300",
                  }}
                />
              </div>
            </div>
          ))}
          {isWaitingForResponse && (
            <div className="flex items-center gap-2">
              <Spinner />
              {messages.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Summarizing this wallet...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Resize handle */}
        <div
          className="h-1 w-full cursor-ns-resize bg-gray-800 hover:bg-gray-700"
          onMouseDown={handleResize}
        />

        {/* Input form */}
        {messages.length > 0 && (
          <div className="right-0 bottom-0 left-0 z-10 flex items-center gap-2 p-4">
            <form
              className="flex w-full items-center gap-2"
              onSubmit={handleSubmit}
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question"
                className="flex-1 bg-black/30"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={!message}
              >
                <SendHorizonal className="size-4" />
              </Button>
            </form>
          </div>
        )}

        {/* Banner */}
      </Card>
      <div className="flex justify-end">
        <Button
          asChild
          variant="link"
          size="sm"
          className="text-gray-500 text-xs"
        >
          <a
            href="https://thirdweb.com/nebula"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by thirdweb Nebula
          </a>
        </Button>
      </div>
    </div>
  );
}
