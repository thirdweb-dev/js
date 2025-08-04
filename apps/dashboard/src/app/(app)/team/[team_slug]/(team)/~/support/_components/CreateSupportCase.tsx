"use client";

import { ArrowRightIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { Team } from "@/api/team/get-team";
import { MarkdownRenderer } from "@/components/blocks/markdown-renderer";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { ThirdwebMiniLogo } from "../../../../../../components/ThirdwebMiniLogo";
import { SupportTicketForm } from "./SupportTicketForm";

export function CreateSupportCase(props: { team: Team; authToken: string }) {
  const { team, authToken } = props;
  const [chatMessages, setChatMessages] = useState<
    {
      id: number;
      content: string;
      isUser: boolean;
      timestamp: string;
      isSuccessMessage?: boolean;
    }[]
  >([
    {
      content:
        "Hi! I'm thirdweb's AI assistant. I can help you troubleshoot issues, answer questions about our products, or create a support case for you. What can I help you with today?",
      id: Date.now(),
      isUser: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined,
  );

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [productLabel, setProductLabel] = useState("");

  // Extracted sendMessageToSiwa function to avoid duplication
  const sendMessageToSiwa = useCallback(
    async (message: string, currentConversationId?: string) => {
      if (!authToken) {
        throw new Error("Authentication token is required");
      }

      const apiUrl = process.env.NEXT_PUBLIC_SIWA_URL;
      const payload = {
        conversationId: currentConversationId,
        message,
        source: "support-in-dashboard",
      };
      const response = await fetch(`${apiUrl}/v1/chat`, {
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "x-team-id": team.id,
        },
        method: "POST",
      });
      const data = await response.json();
      if (
        data.conversationId &&
        data.conversationId !== currentConversationId
      ) {
        setConversationId(data.conversationId);
      }
      return data.data;
    },
    [authToken, team.id],
  );

  const handleChatSend = useCallback(async () => {
    if (!chatInput.trim()) return;

    const currentInput = chatInput;
    setChatInput("");

    const userMsg = {
      content: currentInput,
      id: Date.now(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    const loadingMsg = {
      content: "__reasoning__",
      id: Date.now() + 1,
      isUser: false,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((msgs) => [...msgs, userMsg, loadingMsg]);

    try {
      const aiResponse = await sendMessageToSiwa(currentInput, conversationId);
      setChatMessages((msgs) => [
        ...msgs.slice(0, -1), // remove loading
        {
          content: aiResponse,
          id: Date.now() + 2,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error in handleChatSend:", error);
      setChatMessages((msgs) => [
        ...msgs.slice(0, -1),
        {
          content: "Sorry, something went wrong. Please try again.",
          id: Date.now() + 3,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [chatInput, conversationId, sendMessageToSiwa]);

  const handleChatKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChatSend();
      }
    },
    [handleChatSend],
  );

  const aiIcon = (
    <div className="rounded-full size-9 border shrink-0 flex items-center justify-center bg-inverted">
      <ThirdwebMiniLogo
        className="size-4 text-inverted-foreground"
        isMonoChrome
      />
    </div>
  );

  const userIcon = (
    <div className="rounded-full size-9 border bg-muted/50 shrink-0 flex items-center justify-center">
      <UserIcon className="size-4 text-muted-foreground" />
    </div>
  );

  const [showCreateCaseDialog, setShowCreateCaseDialog] = useState(false);

  return (
    <div className="flex flex-col border bg-card rounded-xl mt-4">
      <div className="px-4 lg:px-12 py-4 lg:py-10 border-b border-dashed">
        <h2 className="text-lg lg:text-2xl font-semibold tracking-tight mb-1 md:mb-0.5 leading-none">
          Chat with support
        </h2>

        <p className="text-muted-foreground text-sm md:text-base text-balance">
          Describe your issue and we'll help you resolve it
        </p>
      </div>
      {/* Chat Messages */}
      <DynamicHeight>
        <div className="flex-1 overflow-y-auto space-y-8 px-4 lg:px-12 pt-8 pb-20">
          {chatMessages.map((message, index) => (
            <div key={message.id}>
              {message.isUser ? (
                <div className="flex items-start gap-3.5">
                  {userIcon}
                  <div className="px-3.5 py-2 rounded-xl border bg-muted/50 relative">
                    <StyledMarkdownRenderer
                      text={message.content}
                      type="user"
                      isMessagePending={false}
                    />
                  </div>
                </div>
              ) : message.content === "__reasoning__" ? (
                <div className="flex items-center gap-3.5">
                  {aiIcon}
                  <TextShimmer
                    text="Reasoning..."
                    className="text-sm md:text-base"
                  />
                </div>
              ) : (
                <div className="flex items-start gap-3.5">
                  {aiIcon}
                  <div>
                    <StyledMarkdownRenderer
                      text={message.content}
                      type="assistant"
                      isMessagePending={false}
                    />

                    {/* Show Create Support Case button in the AI response - only if form not shown and after user interaction */}
                    {index === chatMessages.length - 1 &&
                      !message.isSuccessMessage &&
                      chatMessages.length > 2 && (
                        <div className="mt-5">
                          <Dialog
                            open={showCreateCaseDialog}
                            onOpenChange={setShowCreateCaseDialog}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 rounded-full bg-background"
                              onClick={() => setShowCreateCaseDialog(true)}
                            >
                              Create Support Case
                              <ArrowRightIcon className="w-4 h-4" />
                            </Button>
                            <DialogContent className="p-0 bg-card !gap-0">
                              <DynamicHeight>
                                <DialogHeader className="p-4 lg:p-6 border-b border-dashed space-y-1">
                                  <DialogTitle className="text-xl font-semibold text-foreground tracking-tight">
                                    Create Support Case
                                  </DialogTitle>
                                  <p className="text-muted-foreground text-sm">
                                    Let's create a detailed support case for our
                                    technical team.
                                  </p>
                                </DialogHeader>

                                <SupportTicketForm
                                  closeForm={() => {
                                    setShowCreateCaseDialog(false);
                                  }}
                                  team={team}
                                  productLabel={productLabel}
                                  setProductLabel={setProductLabel}
                                  conversationId={conversationId}
                                  onSuccess={() => {
                                    setShowCreateForm(false);
                                    setProductLabel("");
                                    setChatMessages((prev) => [
                                      ...prev,
                                      {
                                        id: Date.now(),
                                        content: `Support case created successfully!\n\nYour case has been submitted to our technical team. You'll receive updates via email at ${team.billingEmail}.\n\nYou can track your case in the support portal above.`,
                                        isUser: false,
                                        timestamp: new Date().toISOString(),
                                        isSuccessMessage: true,
                                      },
                                    ]);
                                  }}
                                />
                              </DynamicHeight>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}

                    {/* Show Back to Support button for success message */}
                    {!message.isUser && message.isSuccessMessage && (
                      <div className="mt-5">
                        <Button asChild size="sm" className="gap-2">
                          <Link href={`/team/${team.slug}/~/support`}>
                            View all cases
                            <ArrowRightIcon className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </DynamicHeight>

      {/* Chat Input */}
      {!showCreateForm && (
        <div className="px-4 lg:px-12 pb-4 lg:pb-12">
          <div className="relative">
            <AutoResizeTextarea
              placeholder="I am having an issue with..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyPress}
              className="min-h-[120px] rounded-xl"
            />
            <Button
              onClick={handleChatSend}
              variant="default"
              size="sm"
              disabled={!chatInput.trim()}
              className="absolute bottom-3 right-3 disabled:opacity-100"
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StyledMarkdownRenderer(props: {
  text: string;
  isMessagePending: boolean;
  type: "assistant" | "user";
}) {
  return (
    <MarkdownRenderer
      className="text-sm md:text-base text-foreground [&>*:first-child]:mt-0 [&>*:first-child]:border-none [&>*:first-child]:pb-0 [&>*:last-child]:mb-0 leading-relaxed"
      code={{
        className: "bg-transparent",
        ignoreFormattingErrors: true,
      }}
      inlineCode={{ className: "border-none" }}
      li={{ className: "text-foreground leading-relaxed" }}
      markdownText={props.text}
      p={{
        className: "text-foreground leading-relaxed",
      }}
      skipHtml
    />
  );
}
