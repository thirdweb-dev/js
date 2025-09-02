"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronDownIcon, StarIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import { Spinner } from "@/components/ui/Spinner";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ThirdwebMiniLogo } from "../../../../../../components/ThirdwebMiniLogo";
import { checkFeedbackStatus, submitSupportFeedback } from "../apis/feedback";
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
  const feedbackStatusQuery = useQuery({
    queryKey: ["feedbackStatus", ticket.id],
    queryFn: async () => {
      const result = await checkFeedbackStatus(ticket.id);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.hasFeedback;
    },
    enabled: ticket.status === "closed",
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  const feedbackSubmitted = feedbackStatusQuery.data ?? false;
  const isLoading = feedbackStatusQuery.isLoading;
  const hasError = feedbackStatusQuery.isError;

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const queryClient = useQueryClient();
  const submitFeedbackMutation = useMutation({
    mutationFn: async () => {
      if (rating === 0) {
        throw new Error("Please select a rating");
      }
      const result = await submitSupportFeedback({
        rating,
        feedback,
        ticketId: ticket.id,
      });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Thank you for your feedback!");
      setRating(0);
      setFeedback("");
      // mark as submitted immediately
      queryClient.setQueryData(["feedbackStatus", ticket.id], true);
    },
    onError: (err) => {
      console.error("Failed to submit feedback:", err);
      const msg = err instanceof Error ? err.message : String(err ?? "");
      let message = "Failed to submit feedback. Please try again.";
      if (/network|fetch/i.test(msg)) {
        message = "Network error. Please check your connection and try again.";
      } else if (
        /validation|Rating must be|Please select a rating/i.test(msg)
      ) {
        message = msg; // show precise user-facing validation error
      } else if (/API Server error/i.test(msg)) {
        message = "Server error. Please try again later.";
      }
      toast.error(message);
    },
  });

  const handleSendFeedback = () => {
    submitFeedbackMutation.mutate();
  };

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

        {ticket.status === "closed" && isLoading && (
          <div className="border-t p-6">
            <div className="flex items-center gap-2">
              <Spinner className="size-4" />
              <span className="text-muted-foreground text-sm">
                Checking feedback status...
              </span>
            </div>
          </div>
        )}

        {ticket.status === "closed" && !isLoading && !feedbackSubmitted && (
          <div className="border-t p-6">
            <p className="text-muted-foreground text-sm">
              This ticket is closed. Give us a quick rating to let us know how
              we did!
            </p>
            {hasError && (
              <p className="text-destructive text-xs mt-2">
                Couldn't verify prior feedback right now — you can still submit
                a rating.
              </p>
            )}

            <div className="flex gap-2 mb-6 mt-4">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  key={`star-${starValue}`}
                  type="button"
                  onClick={() => handleStarClick(starValue - 1)}
                  className="transition-colors"
                  aria-label={`Rate ${starValue} out of 5 stars`}
                >
                  <StarIcon
                    size={32}
                    className={cn(
                      "transition-colors",
                      starValue <= rating
                        ? "text-pink-500 fill-current stroke-current"
                        : "text-muted-foreground fill-current stroke-current",
                      "hover:text-pink-500",
                    )}
                    strokeWidth={starValue <= rating ? 2 : 1}
                  />
                </button>
              ))}
            </div>

            <div className="relative">
              <AutoResizeTextarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Optional: Tell us how we can improve."
                maxLength={1000}
                className="text-sm w-full bg-card text-foreground rounded-lg p-4 pr-28 min-h-[100px] resize-none border border-border focus:outline-none placeholder:text-muted-foreground"
              />
              <Button
                type="button"
                onClick={handleSendFeedback}
                disabled={submitFeedbackMutation.isPending || rating === 0}
                className="absolute bottom-3 right-3 rounded-full h-auto py-2 px-4"
                variant="secondary"
                size="sm"
              >
                {submitFeedbackMutation.isPending ? (
                  <>
                    <Spinner className="size-4 mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Feedback"
                )}
              </Button>
            </div>
          </div>
        )}

        {ticket.status === "closed" && feedbackSubmitted && (
          <div className="border-t p-6">
            <p className="text-muted-foreground text-sm">
              Thank you for your feedback! We appreciate your input and will use
              it to improve our service.
            </p>
          </div>
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
