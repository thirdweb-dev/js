"use client";

import { format } from "date-fns";
<<<<<<< HEAD
import { ArrowRightIcon, BotIcon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { SupportTicket } from "@/api/support";
import { getSupportTicket, sendMessageToTicket } from "@/api/support";
=======
import {
  ArrowRightIcon,
  BotIcon,
  LoaderCircleIcon,
  SendIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { SupportTicket } from "@/api/support";
import {
  createSupportTicket,
  getSupportTicket,
  sendMessageToTicket,
} from "@/api/support";
>>>>>>> 59aaf21952093816decb52860e0d4524ad72d8a4
import type { Team } from "@/api/team";
import { MarkdownRenderer } from "@/components/blocks/markdown-renderer";
import { Reasoning } from "@/components/chat/Reasoning";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
=======
import { Skeleton } from "@/components/ui/skeleton";
>>>>>>> 59aaf21952093816decb52860e0d4524ad72d8a4
import { Textarea } from "@/components/ui/textarea";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { SupportAIChatCard } from "./SupportAIChatCard";
import { SupportTabs } from "./SupportTabs";
<<<<<<< HEAD
import { SupportTicketForm } from "./SupportTicketForm";
=======
import { SupportForm_SelectInput } from "./shared/SupportForm_SelectInput";

// Dynamic imports for contact forms using named exports
const ConnectSupportForm = dynamic(
  () => import("./contact-forms/connect").then((mod) => mod.ConnectSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const EngineSupportForm = dynamic(
  () => import("./contact-forms/engine").then((mod) => mod.EngineSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const ContractSupportForm = dynamic(
  () =>
    import("./contact-forms/contracts").then((mod) => mod.ContractSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const AccountSupportForm = dynamic(
  () => import("./contact-forms/account").then((mod) => mod.AccountSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const OtherSupportForm = dynamic(
  () => import("./contact-forms/other").then((mod) => mod.OtherSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const PaymentsSupportForm = dynamic(
  () =>
    import("./contact-forms/payments").then((mod) => mod.PaymentsSupportForm),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);
const TokensMarketplaceSupportForm = dynamic(
  () =>
    import("./contact-forms/tokens-marketplace").then(
      (mod) => mod.TokensMarketplaceSupportForm,
    ),
  {
    loading: () => <Skeleton className="h-12" />,
    ssr: false,
  },
);

const productOptions = [
  {
    component: <ConnectSupportForm />,
    label: "Wallets",
  },
  {
    component: <EngineSupportForm />,
    label: "Transactions",
  },
  {
    component: <PaymentsSupportForm />,
    label: "Payments",
  },
  {
    component: <ContractSupportForm />,
    label: "Contracts",
  },
  {
    component: <TokensMarketplaceSupportForm />,
    label: "Tokens / Marketplace",
  },
  {
    component: <AccountSupportForm />,
    label: "Account",
  },
  {
    component: <OtherSupportForm />,
    label: "Other",
  },
];

function ProductAreaSelection(props: {
  productLabel: string;
  setProductLabel: (val: string) => void;
}) {
  const { productLabel, setProductLabel } = props;

  return (
    <div className="flex flex-col gap-6">
      <SupportForm_SelectInput
        formLabel="What do you need help with?"
        name="product"
        onValueChange={setProductLabel}
        options={productOptions.map((o) => o.label)}
        promptText="Brief description of your issue"
        required={true}
        value={productLabel}
      />
      {productOptions.find((o) => o.label === productLabel)?.component}
    </div>
  );
}
>>>>>>> 59aaf21952093816decb52860e0d4524ad72d8a4

interface SupportCasesClientProps {
  tickets: SupportTicket[];
  team: Team;
  authToken?: string;
}

export default function SupportCasesClient({
  tickets,
  team,
  authToken,
}: SupportCasesClientProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCaseDetails, setSelectedCaseDetails] =
    useState<SupportTicket | null>(null);
  const [isLoadingCaseDetails, setIsLoadingCaseDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    {
      id: number;
      content: string;
      isUser: boolean;
      timestamp: string;
      isSuccessMessage?: boolean;
    }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined,
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [_inputFocused, _setInputFocusedd] = useState(false);
  const _router = useDashboardRouter();
  const replySectionRef = useRef<HTMLDivElement>(null);

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [productLabel, setProductLabel] = useState("");
<<<<<<< HEAD
  const [_isSubmittingForm, _setIsSubmittingFormm] = useState(false);
=======
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const _formContainerRef = useRef<HTMLDivElement>(null);
>>>>>>> 59aaf21952093816decb52860e0d4524ad72d8a4

  const selectedCase =
    selectedCaseDetails || tickets.find((c) => c.id === selectedCaseId);

  // Scroll to bottom when messages change
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (messagesEndRef.current && selectedCaseDetails?.messages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedCaseDetails?.messages]);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (chatContainerRef.current && chatMessages.length > 0) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Scroll to show new form fields when product type changes or form updates
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (showCreateForm && chatContainerRef.current) {
      const scrollToBottom = () => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      };

      // Set up a MutationObserver to watch for form changes
      const formContainer = chatContainerRef.current.querySelector("form");
      if (formContainer) {
        const observer = new MutationObserver((mutations) => {
          let shouldScroll = false;
          mutations.forEach((mutation) => {
            if (
              mutation.type === "childList" &&
              mutation.addedNodes.length > 0
            ) {
              // Check if any added nodes contain form fields
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  if (
                    element.querySelector("input, textarea, select") ||
                    element.matches("input, textarea, select")
                  ) {
                    shouldScroll = true;
                  }
                }
              });
            }
          });

          if (shouldScroll) {
            setTimeout(scrollToBottom, 100);
          }
        });

        observer.observe(formContainer, {
          childList: true,
          subtree: true,
        });

        // Initial scroll when form appears
        scrollToBottom();
        setTimeout(scrollToBottom, 100);
        setTimeout(scrollToBottom, 300);

        return () => observer.disconnect();
      }
    }
  }, [showCreateForm]);

  // Scroll to reply section when a case is selected
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (selectedCase && replySectionRef.current && chatContainerRef.current) {
      const chat = chatContainerRef.current;
      const reply = replySectionRef.current;
      // Calculate offset of reply section relative to chat container
      const chatRect = chat.getBoundingClientRect();
      const replyRect = reply.getBoundingClientRect();
      const offset = replyRect.top - chatRect.top + chat.scrollTop;
      chat.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, [selectedCase]);

  // Scroll to bottom of AI chat when messages change
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (showAIChat && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showAIChat]);

<<<<<<< HEAD
=======
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productLabel) {
      toast.error("Please select what you need help with");
      return;
    }

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const description = formData.get("markdown") as string;

    if (!description?.trim()) {
      toast.error("Please provide a description");
      return;
    }

    setIsSubmittingForm(true);

    try {
      // Get all extra fields from the form
      const extraFields = Array.from(formData.entries()).filter(([key]) =>
        key.startsWith("extraInfo_"),
      );

      // Format the message
      let formattedMessage = `Email: ${String(team.billingEmail ?? "-")}\nName: ${String(team.name ?? "-")}\nProduct: ${String(productLabel ?? "-")}`;

      // Add all extra fields above the message
      if (extraFields.length > 0) {
        extraFields.forEach(([key, value]) => {
          if (value) {
            const fieldName = key.replace("extraInfo_", "").replace(/_/g, " ");
            formattedMessage += `\n${fieldName}: ${String(value)}`;
          }
        });
      }

      formattedMessage += `\nMessage:\n${String(description ?? "-")}`;

      if (conversationId) {
        formattedMessage += `\n\n---\nAI Conversation ID: ${conversationId}`;
      }

      await createSupportTicket({
        message: formattedMessage,
        teamSlug: team.slug,
        title: `${productLabel} Issue - ${team.billingEmail} (${team.billingPlan})`,
      });

      // Add success message to chat
      const successMsg = {
        content:
          "Great! Your support case has been created successfully. Our technical team will review it and get back to you soon. You can continue chatting with me if you have any other questions.",
        id: Date.now(),
        isUser: false,
        timestamp: new Date().toISOString(),
        isSuccessMessage: true,
      };

      setChatMessages((msgs) => [...msgs, successMsg]);
      setShowCreateForm(false);
      setProductLabel("");

      toast.success("Support ticket created successfully!");
    } catch (error) {
      console.error("Error creating support ticket:", error);
      toast.error("Failed to create support ticket. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

>>>>>>> 59aaf21952093816decb52860e0d4524ad72d8a4
  const handleSelectCase = async (ticketId: string) => {
    setSelectedCaseId(ticketId);
    setSelectedCaseDetails(null);
    setIsLoadingCaseDetails(true);

    try {
      const ticketDetails = await getSupportTicket(
        ticketId,
        team.slug,
        authToken,
      );
      if (ticketDetails) {
        setSelectedCaseDetails(ticketDetails);
      }
    } catch (_error) {
      toast.error("Failed to load ticket details");
    } finally {
      setIsLoadingCaseDetails(false);
    }
  };

  const handleBackToCases = () => {
    setSelectedCaseId(null);
    setSelectedCaseDetails(null);
    setReplyMessage("");
  };

  const handleSendReply = async () => {
    if (
      !selectedCase ||
      !replyMessage.trim() ||
      !team.unthreadCustomerId ||
      !team.billingEmail
    ) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmittingReply(true);

    try {
      await sendMessageToTicket({
        message: replyMessage,
        teamSlug: team.slug,
        ticketId: selectedCase.id,
      });

      toast.success("Reply sent successfully!");
      setReplyMessage("");

      // Force refresh the ticket details to show the new message
      setSelectedCaseDetails(null);
      setIsLoadingCaseDetails(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const ticketDetails = await getSupportTicket(
          selectedCase.id,
          team.slug,
          authToken,
        );
        if (ticketDetails) {
          setSelectedCaseDetails(ticketDetails);
        }
      } catch (refreshError) {
        console.error("Error refreshing ticket details:", refreshError);
      } finally {
        setIsLoadingCaseDetails(false);
      }
    } catch (_error) {
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSendReply();
    }
  };

  // Filter tickets based on active tab and search query
  const filteredTickets = tickets.filter((ticket) => {
    // Filter by tab
    let matchesTab = true;
    switch (activeTab) {
      case "open":
        matchesTab =
          (ticket.status as string) === "in_progress" ||
          (ticket.status as string) === "needs_response" ||
          (ticket.status as string) === "on_hold";
        break;
      case "closed":
        matchesTab = ticket.status === "resolved" || ticket.status === "closed";
        break;
      default:
        matchesTab = true;
    }

    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Helper function to check if ticket matches search query
  const matchesSearch = (ticket: SupportTicket) => {
    return (
      searchQuery === "" ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Calculate counts for tabs
  const counts = {
    all: tickets.filter(matchesSearch).length,
    closed: tickets.filter(
      (ticket) =>
        (ticket.status === "resolved" || ticket.status === "closed") &&
        matchesSearch(ticket),
    ).length,
    open: tickets.filter(
      (ticket) =>
        ((ticket.status as string) === "in_progress" ||
          (ticket.status as string) === "needs_response" ||
          (ticket.status as string) === "on_hold") &&
        matchesSearch(ticket),
    ).length,
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
      case "closed":
        return "border-gray-500 text-gray-500 bg-gray-500/10";
      case "in_progress":
        return "border-red-500 text-red-500 bg-red-500/10";
      case "needs_response":
        return "border-yellow-500 text-yellow-500 bg-yellow-500/10";
      case "on_hold":
        return "border-purple-500 text-purple-500 bg-purple-500/10";
      default:
        return "border-yellow-500 text-yellow-500 bg-yellow-500/10";
    }
  };

  const getStatusLabel = (status: string, _ticket?: SupportTicket) => {
    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case "closed":
        return "Closed";
      case "resolved":
        return "Resolved";
      case "in_progress":
        return "Needs Response";
      case "needs_response":
        return "In Progress";
      case "on_hold":
        return "On Hold";
      default:
        return "In Progress";
    }
  };

  async function sendMessageToSiwa(
    message: string,
    currentConversationId?: string,
  ) {
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
    if (data.conversationId && data.conversationId !== conversationId) {
      setConversationId(data.conversationId);
    }
    return data.data;
  }

  async function handleStartChat(initialMessage: string) {
    setShowAIChat(true);
    // Update AI greeting message
    const initialAIMsg = {
      content:
        "Hi! I’m thirdweb’s AI assistant — I’ll help you troubleshoot. If I can’t fix it, I’ll pass it to our support",
      id: Date.now(),
      isUser: false,
      timestamp: new Date().toISOString(),
    };
    const userMsg = {
      content: initialMessage,
      id: Date.now() + 1,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setChatMessages([
      initialAIMsg,
      userMsg,
      {
        content: "__reasoning__",
        id: Date.now() + 2,
        isUser: false,
        timestamp: new Date().toISOString(),
      },
    ]);
    setChatInput("");
    try {
      const aiResponse = await sendMessageToSiwa(initialMessage);
      setChatMessages([
        initialAIMsg,
        userMsg,
        {
          content: aiResponse,
          id: Date.now() + 3,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (_error) {
      setChatMessages([
        initialAIMsg,
        userMsg,
        {
          content: "Sorry, something went wrong. Please try again.",
          id: Date.now() + 4,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }

  async function handleChatSend() {
    if (!chatInput.trim()) return;
    const userMsg = {
      content: chatInput,
      id: Date.now(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((msgs) => [
      ...msgs,
      userMsg,
      {
        content: "__reasoning__",
        id: Date.now() + 1,
        isUser: false,
        timestamp: new Date().toISOString(),
      },
    ]);
    setChatInput("");
    try {
      const aiResponse = await sendMessageToSiwa(chatInput, conversationId);
      setChatMessages((msgs) => [
        ...msgs.slice(0, -1), // remove loading
        {
          content: aiResponse,
          id: Date.now() + 2,
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (_error) {
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
  }

  function handleChatKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  }

  if (showAIChat) {
    return (
      <div className="min-h-screen bg-[#000000] text-white">
        <div className="container mx-auto p-6">
          <div className="mb-4">
            <Button
              onClick={() => {
                setShowAIChat(false);
                setChatMessages([]);
                setShowCreateForm(false);
              }}
              variant="outline"
              className="border-[#1F1F1F] bg-[#0A0A0A] text-white hover:bg-[#1F1F1F] hover:text-white"
            >
              ← Back to Support Portal
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="border border-[#1F1F1F] bg-[#0A0A0A] rounded-lg h-[800px] flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-[#1F1F1F]">
                <div className="relative bg-[#2663EB]/10 p-2 rounded-full">
                  <BotIcon className="w-5 h-5 text-[#2663EB]" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A0A0A]"></div>
                </div>
                <div>
                  <h3 className="text-white font-medium">Ask AI for support</h3>
                  <p className="text-xs text-[#737373]">Online</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div
                className="flex-1 p-6 overflow-y-auto space-y-4"
                ref={chatContainerRef}
              >
                {chatMessages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.isUser
                          ? "bg-[#2663EB] text-white"
                          : "bg-[#1F1F1F] text-white border border-[#333333]"
                      }`}
                    >
                      {message.isUser ? (
                        <p className="text-sm whitespace-pre-line">
                          {message.content}
                        </p>
                      ) : message.content === "__reasoning__" ? (
                        <Reasoning isPending={true} texts={[]} />
                      ) : (
                        <MarkdownRenderer
                          className="text-sm"
                          li={{ className: "text-foreground" }}
                          p={{ className: "text-foreground" }}
                          markdownText={message.content}
                        />
                      )}
                      <p className="text-xs opacity-70 mt-2">
                        {format(new Date(message.timestamp), "h:mm a")}
                      </p>

                      {/* Show Back to Support Portal button for success message */}
                      {!message.isUser && message.isSuccessMessage && (
                        <div className="mt-3 pt-3 border-t border-[#333333]">
                          <Button
                            onClick={() => {
                              setShowAIChat(false);
                              setChatMessages([]);
                              setShowCreateForm(false);
                            }}
                            size="sm"
                            className="bg-[#2663EB] hover:bg-[#2663EB]/80 text-white transition-opacity"
                          >
                            Back to Support Portal
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      )}

                      {/* Show Create Support Case button in the AI response (index 2) - only if form not shown */}
                      {!message.isUser &&
                        index === chatMessages.length - 1 &&
                        !showCreateForm &&
                        !message.isSuccessMessage &&
                        message.content !== "__reasoning__" && (
                          <div className="mt-3 pt-3 border-t border-[#333333]">
                            <Button
                              onClick={() => setShowCreateForm(true)}
                              size="sm"
                              className="bg-[#2663EB] hover:bg-[#2663EB]/80 text-white transition-opacity"
                            >
                              Create Support Case
                              <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        )}

                      {/* Show Support Case Form in the same message bubble when button is clicked */}
                      {!message.isUser &&
                        index === chatMessages.length - 1 &&
                        showCreateForm &&
                        message.content !== "__reasoning__" && (
                          <div className="mt-4 pt-4 border-t border-[#333333]">
                            <div className="mb-4">
                              <h3 className="text-lg font-semibold text-white mb-2">
                                Create Support Case
                              </h3>
                              <p className="text-sm text-[#737373]">
                                Let's create a detailed support case for our
                                technical team.
                              </p>
                            </div>

<<<<<<< HEAD
                            <SupportTicketForm
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
                                    content: `✅ **Support case created successfully!**\n\nYour case has been submitted to our technical team. You'll receive updates via email at ${team.billingEmail}.\n\nYou can track your case in the support portal above.`,
                                    isUser: false,
                                    timestamp: new Date().toISOString(),
                                    isSuccessMessage: true,
                                  },
                                ]);
                              }}
                            />
=======
                            <form
                              onSubmit={handleFormSubmit}
                              ref={formRef}
                              className="space-y-4"
                            >
                              <ProductAreaSelection
                                productLabel={productLabel}
                                setProductLabel={setProductLabel}
                              />

                              {/* Submit Buttons */}
                              <div className="flex justify-end gap-3 pt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setShowCreateForm(false)}
                                  className="border-[#333333] bg-[#0A0A0A] text-white hover:bg-[#333333] hover:text-white"
                                  size="sm"
                                  disabled={isSubmittingForm}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  className="bg-[#2663EB] hover:bg-[#2663EB]/80 text-white transition-opacity"
                                  size="sm"
                                  disabled={isSubmittingForm}
                                >
                                  {isSubmittingForm ? (
                                    <>
                                      <LoaderCircleIcon className="animate-spin w-4 h-4 mr-2 inline" />
                                      Creating...
                                    </>
                                  ) : (
                                    "Create Support Case"
                                  )}
                                </Button>
                              </div>
                            </form>
>>>>>>> 59aaf21952093816decb52860e0d4524ad72d8a4
                          </div>
                        )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              {!showCreateForm && (
                <div className="p-6 border-t border-[#1F1F1F]">
                  <div className="flex gap-3">
                    <Textarea
                      placeholder="Type your message here..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleChatKeyPress}
                      className="flex-1 min-h-[60px] max-h-[120px] bg-[#0A0A0A] border-[#1F1F1F] text-white placeholder:text-[#737373] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2663EB] resize-none"
                    />
                    <Button
                      onClick={handleChatSend}
                      disabled={!chatInput.trim()}
                      className="bg-[#2663EB] hover:bg-[#2663EB]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed self-end"
                    >
                      <SendIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-[#737373] mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCase) {
    return (
      <div className="min-h-screen bg-[#000000] text-white">
        <div className="container mx-auto p-6">
          <div className="mb-4">
            <Button
              className="border-[#1F1F1F] bg-[#0A0A0A] text-white hover:bg-[#1F1F1F] hover:text-white"
              onClick={handleBackToCases}
              variant="outline"
            >
              ← Back to Cases
            </Button>
          </div>

          <div className="border border-[#1F1F1F] bg-[#0A0A0A] p-6 rounded-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Ticket #{selectedCase.id}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={getStatusColor(selectedCase.status)}>
                  {getStatusLabel(selectedCase.status, selectedCase)}
                </Badge>
                <span className="text-sm text-[#737373]">
                  #{selectedCase.id}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-[#737373]">Status:</span>
                  <p className="text-white">
                    {getStatusLabel(selectedCase.status, selectedCase)}
                  </p>
                </div>
                <div>
                  <span className="text-[#737373]">Created:</span>
                  <p className="text-white">
                    {format(new Date(selectedCase.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#1F1F1F] pt-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  Messages
                </h3>
                <div className="space-y-4 mb-6">
                  {isLoadingCaseDetails ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-[#737373]">Loading messages...</div>
                    </div>
                  ) : selectedCase.messages &&
                    selectedCase.messages.length > 0 ? (
                    selectedCase.messages.map((message) => {
                      const isCustomer = message.author?.type === "customer";
                      const authorName = message.author?.name || "Support";
                      const displayName = isCustomer ? "You" : authorName;

                      let messageContent =
                        message.content || "No content available";

                      if (messageContent.includes("/unthread send")) {
                        messageContent = messageContent
                          .replace("/unthread send", "")
                          .trim();
                      }

                      const messageDate =
                        message.timestamp || message.createdAt;

                      return (
                        <div
                          className="border border-[#1F1F1F] bg-[#0A0A0A] p-4 rounded"
                          key={message.id}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">
                                {displayName}
                              </span>
                              <Badge
                                className={
                                  !isCustomer
                                    ? "border-blue-500 text-blue-500 bg-blue-500/10 text-xs"
                                    : "border-green-500 text-green-500 bg-green-500/10 text-xs"
                                }
                                variant="outline"
                              >
                                {!isCustomer ? "Support" : "Customer"}
                              </Badge>
                            </div>
                            <span className="text-xs text-[#737373]">
                              {format(
                                new Date(messageDate),
                                "MMM d, yyyy 'at' h:mm a",
                              )}
                            </span>
                          </div>
                          <div className="text-[#9ca3af]">
                            <div
                              style={{ whiteSpace: "pre-line" }}
                              className="text-sm text-foreground"
                            >
                              {messageContent}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-[#737373]">
                        No messages yet for this ticket.
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Section */}
                {selectedCase.status !== "closed" &&
                selectedCase.status !== "resolved" ? (
                  <div
                    className="border-t border-[#1F1F1F] pt-4"
                    ref={replySectionRef}
                  >
                    <h4 className="text-md font-medium text-white mb-3">
                      Reply to this case
                    </h4>
                    <div className="space-y-3">
                      <Textarea
                        className="min-h-[100px] bg-[#0A0A0A] border-[#1F1F1F] text-white placeholder:text-[#737373] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2663EB] resize-none"
                        onChange={(e) => setReplyMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message here..."
                        value={replyMessage}
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-[#737373]">
                          Markdown Supported
                        </p>
                        <Button
                          className="bg-[#2663EB] hover:bg-[#2663EB]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!replyMessage.trim() || isSubmittingReply}
                          onClick={handleSendReply}
                        >
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-[#1F1F1F] pt-4">
                    <p className="text-[#737373] text-sm">
                      This ticket is closed. If you need further assistance,
                      please create a new ticket.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Support Portal
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-sm text-[#737373]">
                  Create and view support cases for your projects
                </p>
                <Button
                  className="text-[#2663EB] hover:text-[#2663EB]/80 p-0 h-auto font-normal text-sm"
                  variant="link"
                  asChild
                >
                  <a
                    href="https://portal.thirdweb.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read our Documentation
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <SupportAIChatCard
          _authToken={authToken || ""}
          _teamId={team.id}
          onStartChat={handleStartChat}
        />

        <SupportTabs
          activeTab={activeTab}
          counts={counts}
          onSearchChange={setSearchQuery}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
        />

        {filteredTickets.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] mt-6">
            <div className="text-center">
              <h3 className="mb-2 font-medium text-lg text-white">
                No cases found
              </h3>
              <p className="text-[#737373] text-sm">
                {activeTab === "all"
                  ? "You don't have any support cases yet."
                  : `No ${activeTab} cases found.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-6">
            {filteredTickets.map((ticket) => (
              <button
                className={`w-full border bg-[#0A0A0A] hover:border-[#333333] transition-colors cursor-pointer p-4 rounded-lg text-left ${
                  getStatusLabel(ticket.status, ticket) === "Needs Response"
                    ? "border-red-500/50 bg-red-500/5"
                    : "border-[#1F1F1F]"
                }`}
                key={ticket.id}
                onClick={() => handleSelectCase(ticket.id)}
                type="button"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status, ticket)}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          Ticket #{ticket.id}
                        </span>
                      </div>
                    </div>
                    <div className="text-[#737373] text-sm">
                      {format(
                        new Date(ticket.updatedAt || ticket.createdAt),
                        "MMM d, yyyy",
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
