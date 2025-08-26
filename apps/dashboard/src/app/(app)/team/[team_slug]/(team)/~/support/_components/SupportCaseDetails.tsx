"use client";

import { format } from "date-fns";
import { ChevronDownIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { Team } from "@/api/team/get-team";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { ThirdwebMiniLogo } from "../../../../../../components/ThirdwebMiniLogo";
import { submitSupportFeedback } from "../apis/feedback";
import { sendMessageToTicket } from "../apis/support";
import type { SupportMessage, SupportTicket } from "../types/tickets";
import {
  getTicketStatusBadgeVariant,
  getTicketStatusLabel,
} from "../utils/ticket-status";

interface SupportCaseDetailsProps {
  ticket: SupportTicket;
  team: Team;
}

export function SupportCaseDetails({ ticket, team }: SupportCaseDetailsProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [localMessages, setLocalMessages] = useState(ticket.messages || []);

  // rating/feedback
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  // Check if feedback has already been submitted for this ticket
  const [feedbackSubmitted, setFeedbackSubmitted] = useLocalStorage(
    `feedback_submitted_${ticket.id}`,
    false,
    false,
  );

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSendFeedback = useCallback(async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      const result = await submitSupportFeedback({
        rating,
        feedback,
        ticketId: ticket.id,
        teamId: team.id,
      });

      if ("error" in result) {
        throw new Error(result.error);
      }

      // Mark feedback as submitted
      setFeedbackSubmitted(true);

      toast.success("Thank you for your feedback!");
      setRating(0);
      setFeedback("");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    }
  }, [rating, feedback, ticket.id, team.id, setFeedbackSubmitted]);

  const handleSendReply = async () => {
    if (!team.unthreadCustomerId) {
      toast.error("No unthread customer id found for this team");
      return;
    }

    if (!team.billingEmail) {
      toast.error("No Billing email found for this team");
      return;
    }

    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmittingReply(true);

    // Optimistically add the message to the UI immediately
    const optimisticMessage = {
      id: `optimistic-${crypto.randomUUID()}`,
      content: replyMessage,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      author: {
        name: "You",
        email: team.billingEmail || "",
        type: "customer" as const,
      },
    };

    setLocalMessages((prev) => [...prev, optimisticMessage]);
    setReplyMessage("");

    try {
      const result = await sendMessageToTicket({
        message: replyMessage,
        teamSlug: team.slug,
        teamId: team.id,
        ticketId: ticket.id,
      });

      if ("error" in result) {
        throw new Error(result.error);
      }

      setReplyMessage("");
    } catch (error) {
      console.error("Failed to send reply:", error);
      toast.error("Failed to send Message. Please try again.");

      // Remove the optimistic message on error
      setLocalMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id),
      );
      setReplyMessage(replyMessage); // Restore the message
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }

      e.preventDefault();
      handleSendReply();
    }
  };

  return (
    <div className="flex flex-col grow">
      <div className="h-3" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/team/${team.slug}/~/support`}>Cases</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="h-3" />

      <TicketHeader
        title={ticket.title}
        createdAt={ticket.createdAt}
        updatedAt={ticket.updatedAt}
        status={ticket.status}
      />

      <div className="h-6" />

      <div className="border bg-card rounded-lg">
        <div>
          {localMessages && localMessages.length > 0 ? (
            localMessages.map((message) => {
              return <TicketMessage key={message.id} message={message} />;
            })
          ) : (
            <div className="flex items-center justify-center py-16">
              <div className="text-muted-foreground text-sm">
                No Messages Found
              </div>
            </div>
          )}
        </div>

        {/* Feedback Section - Only show for closed tickets */}
        {ticket.status === "closed" && (
          <>
            {!feedbackSubmitted && (
              <>
                <div className="border-t p-6">
                  <p className="text-muted-foreground text-sm">
                    This ticket is closed. Give us a quick rating to let us know
                    how we did!
                  </p>
                </div>

                <div className="flex gap-2 mb-6 px-6">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={`star-${starValue}`}
                      type="button"
                      onClick={() => handleStarClick(starValue - 1)}
                      className="transition-colors"
                      aria-label={`Rate ${starValue} out of 5 stars`}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill={starValue <= rating ? "#ff00aa" : "none"}
                        stroke={starValue <= rating ? "#ff00aa" : "#666"}
                        strokeWidth={starValue <= rating ? "2" : "1"}
                        className="hover:fill-pink-500 hover:stroke-pink-500 rounded-sm"
                        rx="2"
                        aria-hidden="true"
                      >
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                      </svg>
                    </button>
                  ))}
                </div>

                <div className="relative p-6">
                  <div className="relative">
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Optional: Tell us how we can improve."
                      className="text-muted-foreground text-sm w-full bg-black text-white rounded-lg p-4 pr-28 min-h-[100px] resize-none border border-[#262626] focus:border-[#262626] focus:outline-none placeholder-[#A1A1A1]"
                    />
                    <button
                      type="button"
                      onClick={handleSendFeedback}
                      className="absolute mb-2 bottom-3 right-3 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      Send Feedback
                    </button>
                  </div>
                </div>
              </>
            )}

            {feedbackSubmitted && (
              <div className="border-t p-6">
                <p className="text-muted-foreground text-sm">
                  This ticket is closed. If you need further assistance, please
                  create a new ticket.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="h-8" />

      {/* Reply Section */}
      {ticket.status !== "closed" && ticket.status !== "resolved" && (
        <div>
          <div className="relative">
            <AutoResizeTextarea
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Your message..."
              value={replyMessage}
              className="min-h-[120px] bg-card leading-relaxed rounded-lg"
            />
            <Button
              className="absolute bottom-3 right-3 gap-2 disabled:opacity-100 rounded-lg h-auto py-1.5 px-3"
              size="sm"
              disabled={!replyMessage.trim() || isSubmittingReply}
              onClick={handleSendReply}
              variant="default"
            >
              {isSubmittingReply ? <Spinner className="size-4" /> : "Send"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function TicketHeader(props: {
  title: string;
  createdAt: string;
  updatedAt: string;
  status: SupportTicket["status"];
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground md:mb-1 mb-3 tracking-tight leading-tight">
          {props.title}
        </h2>

        <div className="flex-col md:flex-row flex lg:items-center gap-1 md:gap-2.5">
          <p className="text-muted-foreground text-sm">
            Opened on {format(new Date(props.createdAt), "MMM d, yyyy")}
          </p>

          <div className="size-1 bg-muted-foreground rounded-full hidden md:block" />

          <p className="text-muted-foreground text-sm">
            Last updated on {format(new Date(props.updatedAt), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      <Badge
        variant={getTicketStatusBadgeVariant(props.status)}
        className="text-sm px-3 py-1.5"
      >
        {getTicketStatusLabel(props.status)}
      </Badge>
    </div>
  );
}

function TicketMessage(props: { message: SupportMessage }) {
  const { message } = props;
  const [isExpanded, setIsExpanded] = useState(true);

  const isCustomer = message.author?.type === "customer";
  const displayName = isCustomer ? "You" : "thirdweb Support";
  let messageContent = message.content || "No content available";

  messageContent = messageContent
    .replaceAll("/unthread send", "")
    .trim()
    // make sure there are no more than 2 new lines in a row
    .replace(/\n{2,}/g, "\n\n");

  // cut off anything after "AI Conversation ID"
  messageContent = messageContent.split("---\nAI Conversation ID")[0] || "";

  return (
    <div
      className="border-b flex gap-3 p-4 lg:p-6 last:border-b-0"
      key={message.id}
    >
      {/* left - icon */}
      <div
        className={cn(
          "rounded-full size-8 border flex items-center justify-center shrink-0 translate-y-1",
          isCustomer ? "bg-muted" : "bg-inverted",
        )}
      >
        {isCustomer ? (
          <UserIcon className="size-4" />
        ) : (
          <ThirdwebMiniLogo
            className="size-5 text-inverted-foreground"
            isMonoChrome
          />
        )}
      </div>
      {/* right */}
      <div className="min-w-0 flex-1">
        {/* User, Timestamp */}
        <div className="flex items-center gap-3 justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground text-sm">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {format(new Date(message.timestamp), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>

          <Button
            variant="ghost"
            className="size-10 rounded-full p-0 translate-x-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDownIcon
              className={cn(
                "size-5 text-muted-foreground transition-transform",
                isExpanded ? "rotate-180" : "",
              )}
            />
          </Button>
        </div>

        {/* message */}
        <DynamicHeight>
          <div>
            {isExpanded ? (
              <div className="text-sm text-foreground break-words overflow-auto whitespace-pre-wrap leading-relaxed pt-4">
                {messageContent}
              </div>
            ) : (
              <div className="h-[1px]" />
            )}
          </div>
        </DynamicHeight>
      </div>
    </div>
  );
}
