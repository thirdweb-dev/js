"use client";

import { format } from "date-fns";
import { PlusIcon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { SupportTicket } from "@/api/support";
import { getSupportTicket, sendMessageToTicket } from "@/api/support";
import type { Team } from "@/api/team";
import { CustomChatButton } from "@/components/chat/CustomChatButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { siwaExamplePrompts } from "../../../../../../(dashboard)/support/definitions";
import { SupportTabs } from "./SupportTabs";

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

  const selectedCase =
    selectedCaseDetails || tickets.find((c) => c.id === selectedCaseId);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && selectedCaseDetails?.messages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedCaseDetails?.messages]);

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
    } catch (error) {
      console.error("Error fetching ticket details:", error);
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
        onBehalfOf: {
          email: team.billingEmail,
          id: team.unthreadCustomerId || "",
          name: team.name,
        },
        teamSlug: team.slug,
        ticketId: selectedCase.id,
      });

      toast.success("Reply sent successfully!");
      setReplyMessage("");

      // Force refresh the ticket details to show the new message
      // Clear cached details first to ensure fresh fetch
      setSelectedCaseDetails(null);
      setIsLoadingCaseDetails(true);

      try {
        // Add a small delay to ensure the message is processed on the server
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
    } catch (error) {
      console.error("Error sending reply:", error);
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
        matchesTab = ticket.status === "open";
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
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.openedBy.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Helper function to check if ticket matches search query
  const matchesSearch = (ticket: SupportTicket) => {
    return (
      searchQuery === "" ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.openedBy.toLowerCase().includes(searchQuery.toLowerCase())
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
      (ticket) => ticket.status === "open" && matchesSearch(ticket),
    ).length,
  };
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "border-green-500 text-green-500 bg-green-500/10";
      case "resolved":
      case "closed":
        return "border-gray-500 text-gray-500 bg-gray-500/10";
      case "in_progress":
        return "border-yellow-500 text-yellow-500 bg-yellow-500/10";
      default:
        return "border-yellow-500 text-yellow-500 bg-yellow-500/10";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "Open";
      case "closed":
        return "Closed";
      case "resolved":
        return "Resolved";
      case "in_progress":
        return "In Progress";
      default:
        return "Open";
    }
  };

  const getLastMessageAuthor = (ticket: SupportTicket) => {
    if (ticket.messages && ticket.messages.length > 0) {
      const lastMessage = ticket.messages[ticket.messages.length - 1];
      return lastMessage?.author.type || "customer";
    }
    // If no messages, assume it's from customer (the ticket opener)
    return "customer";
  };

  const needsResponse = (ticket: SupportTicket) => {
    return (
      getLastMessageAuthor(ticket) === "customer" && ticket.status === "open"
    );
  };

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
                {selectedCase.title}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <Badge
                  className={getStatusColor(selectedCase.status)}
                  variant="outline"
                >
                  {getStatusLabel(selectedCase.status)}
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
                    {getStatusLabel(selectedCase.status)}
                  </p>
                </div>
                <div>
                  <span className="text-[#737373]">Opened by:</span>
                  <p className="text-white">{selectedCase.openedBy}</p>
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
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {isLoadingCaseDetails ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-[#737373]">Loading messages...</div>
                    </div>
                  ) : selectedCase.messages &&
                    selectedCase.messages.length > 0 ? (
                    selectedCase.messages.map((message) => (
                      <div
                        className="border border-[#1F1F1F] bg-[#0A0A0A] p-4 rounded"
                        key={message.id}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {message.author.type === "customer"
                                ? "You"
                                : message.author.name || "Support"}
                            </span>
                            <Badge
                              className={
                                message.author.type === "user"
                                  ? "border-blue-500 text-blue-500 bg-blue-500/10 text-xs"
                                  : "border-green-500 text-green-500 bg-green-500/10 text-xs"
                              }
                              variant="outline"
                            >
                              {message.author.type === "user"
                                ? "Support"
                                : "Customer"}
                            </Badge>
                          </div>
                          <span className="text-xs text-[#737373]">
                            {format(
                              new Date(message.createdAt),
                              "MMM d, yyyy 'at' h:mm a",
                            )}
                          </span>
                        </div>
                        <div className="text-[#9ca3af] whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="border border-[#1F1F1F] bg-[#0A0A0A] p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-white">
                          {selectedCase.openedBy}
                        </span>
                        <span className="text-xs text-[#737373]">
                          {format(
                            new Date(selectedCase.createdAt),
                            "MMM d, yyyy 'at' h:mm a",
                          )}
                        </span>
                      </div>
                      <p className="text-[#9ca3af]">
                        {selectedCase.lastMessage ||
                          "No message content available"}
                      </p>
                    </div>
                  )}
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Section */}
                <div className="border-t border-[#1F1F1F] pt-4">
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
                        Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to send
                      </p>
                      <Button
                        className="bg-[#2663EB] hover:bg-[#2663EB]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!replyMessage.trim() || isSubmittingReply}
                        onClick={handleSendReply}
                      >
                        <SendIcon className="w-4 h-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
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
                >
                  Learn more
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-block [&>button]:border-[#1F1F1F] [&>button]:bg-[#0A0A0A] [&>button]:text-white [&>button]:hover:bg-[#1F1F1F] [&>button]:hover:text-white [&>button]:rounded-md [&>button]:shadow-none">
                <CustomChatButton
                  authToken={authToken}
                  clientId={undefined}
                  examplePrompts={siwaExamplePrompts}
                  isFloating={false}
                  isLoggedIn={!!authToken}
                  label="Ask Nebula AI for support"
                  networks="all"
                  pageType="support"
                  teamId={team.id}
                />
              </div>
              <Button
                className="bg-[#2663EB] hover:bg-[#2663EB]/90 text-white"
                onClick={() => {
                  window.location.href = window.location.pathname + "/create";
                }}
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Open a support case
              </Button>
            </div>
          </div>
        </div>

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
                  needsResponse(ticket)
                    ? "border-orange-500/50 bg-orange-500/5"
                    : "border-[#1F1F1F]"
                }`}
                key={ticket.id}
                onClick={() => handleSelectCase(ticket.id)}
                type="button"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getStatusColor(ticket.status)}
                        variant="outline"
                      >
                        {getStatusLabel(ticket.status)}
                      </Badge>
                      {needsResponse(ticket) && (
                        <Badge
                          className="border-orange-500 text-orange-500 bg-orange-500/10 text-xs"
                          variant="outline"
                        >
                          Needs Response
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {ticket.title}
                        </span>
                        <span className="text-[#737373] text-sm font-mono">
                          #{ticket.id}
                        </span>
                      </div>
                      {ticket.lastMessage && (
                        <p className="text-[#737373] text-sm mt-1 truncate max-w-[300px]">
                          Last: {ticket.lastMessage}
                        </p>
                      )}
                    </div>
                    <div className="text-[#737373] text-sm">
                      {ticket.openedBy}
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
