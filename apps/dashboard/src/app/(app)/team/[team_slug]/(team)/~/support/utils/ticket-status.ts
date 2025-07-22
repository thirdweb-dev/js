import type { BadgeProps } from "@/components/ui/badge";
import type { SupportTicketStatus } from "../types/tickets";

export function getTicketStatusBadgeVariant(
  status: SupportTicketStatus,
): BadgeProps["variant"] {
  switch (status) {
    case "open":
      return "default";
    case "resolved":
      return "success";
    case "closed":
      return "outline";
    // invert logic for user
    case "in_progress":
      return "warning";
    // invert logic for user
    case "needs_response":
      return "default";
    case "on_hold":
      return "outline";
    default:
      return "default";
  }
}

export function getTicketStatusLabel(status: SupportTicketStatus): string {
  switch (status) {
    case "closed":
      return "Closed";
    case "open":
      return "Open";
    case "resolved":
      return "Resolved";
    // Invert logic for user - in Progress becomes needs response
    case "in_progress":
      return "Response Required";
    // Invert logic for user - needs response becomes in progress
    case "needs_response":
      return "In Progress";
    case "on_hold":
      return "On Hold";
    default:
      return "In Progress";
  }
}
