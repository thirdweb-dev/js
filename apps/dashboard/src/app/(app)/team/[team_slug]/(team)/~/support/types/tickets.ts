export type SupportMessage = {
  id: string;
  content: string;
  createdAt: string;
  timestamp: string;
  author?: {
    name: string;
    email: string;
    type: "user" | "customer";
  };
};

export type SupportTicketStatus =
  | "needs_response"
  | "in_progress"
  | "on_hold"
  | "closed"
  | "open"
  | "resolved";

export type SupportTicket = {
  id: string;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  respondedAt: string | null;
  messages: SupportMessage[];
  title: string;
};

export type SupportTicketListItem = {
  id: string;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  title: string;
};
