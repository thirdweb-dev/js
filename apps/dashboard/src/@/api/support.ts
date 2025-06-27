"use server";
import "server-only";

// UNTHREAD_API_KEY is used as Bearer token
const UNTHREAD_API_KEY = process.env.UNTHREAD_API_KEY || "";
const UNTHREAD_BASE_URL =
  process.env.UNTHREAD_BASE_URL || "https://thirdweb.unthread.io";
const UNTHREAD_TRIAGE_CHANNEL_ID = process.env.UNTHREAD_TRIAGE_CHANNEL_ID || "";
const UNTHREAD_EMAIL_INBOX_ID = process.env.UNTHREAD_EMAIL_INBOX_ID || "";
// Hardcoded mapping of customer plans to customer IDs
const PLAN_TO_CUSTOMER_ID_MAP: Record<string, string> = {
  accelerate: process.env.UNTHREAD_GROWTH_TIER_ID || "",
  growth: process.env.UNTHREAD_GROWTH_TIER_ID || "",
  pro: process.env.UNTHREAD_PRO_TIER_ID || "",
  scale: process.env.UNTHREAD_PRO_TIER_ID || "",
  starter: process.env.UNTHREAD_FREE_TIER_ID || "",
};

export interface SupportTicket {
  id: string;
  title: string;
  status: "open" | "closed" | "resolved";
  priority?: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  openedBy: string;
  customerId?: string;
  tags?: string[];
  assignee?: string;
  lastMessage?: string;
  messages?: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
    type: "user" | "customer";
  };
}

// internal types for Unthread API responses
interface UnthreadConversation {
  id: string;
  friendlyId?: string;
  title?: string;
  summary?: string;
  status: string;
  priority?: string | number;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
  customerId?: string;
  customer?: {
    id: string;
    name: string;
  };
  tags?: Array<{
    id: string;
    name: string;
  }>;
  assignedToUser?: {
    id: string;
    name: string;
  };
  initialMessage?: {
    content: string;
    sentByUser?: {
      name: string;
      email: string;
      type?: string;
    };
  };
  latestMessage?: {
    content: string;
  };
  lastMessage?: {
    content: string;
    author: {
      name: string;
      email: string;
      type?: string;
    };
  };
}

// Reusable types
interface UserInfo {
  userId: string;
  email: string;
  name: string;
}

export interface CreateSupportTicketRequest {
  title: string;
  message: string;
  plan: string; // Customer plan (e.g., "free", "pro", "enterprise")
  onBehalfOf: UserInfo;
  attachments?: File[];
}

export interface SendMessageRequest {
  ticketId: string;
  message: string;
  onBehalfOf: UserInfo;
  attachments?: File[];
}

// Internal payload types
interface CreateConversationPayload {
  type: "email";
  title: string;
  body: {
    type: "markdown";
    value: string;
  };
  status: "open" | "in_progress" | "on_hold" | "closed";
  customerId: string;
  emailInboxId: string;
  triageChannelId: string;
  onBehalfOf: UserInfo & { id: string };
}

interface SendMessagePayload {
  body: {
    type: "markdown";
    value: string;
  };
  onBehalfOf: UserInfo;
}

function mapUnthreadMessage(msg: {
  ts?: string;
  id?: string;
  text?: string;
  content?: string;
  timestamp?: string;
  createdAt?: string;
  user?: {
    name: string;
    email: string;
    type?: string;
  };
  sentByUser?: {
    name: string;
    email: string;
    type?: string;
  };
}): SupportMessage {
  const author = msg.user || msg.sentByUser;
  return {
    author: {
      email: author?.email || "",
      name: author?.name || "Unknown",
      type: author?.type === "user" ? "user" : "customer",
    },
    content: msg.text || msg.content || "",
    createdAt: msg.timestamp || msg.createdAt || "",
    id: msg.ts || msg.id || "",
  };
}

function mapUnthreadToSupportTicket(
  conversation: UnthreadConversation,
): SupportTicket {
  // Map status values from Unthread to our expected format
  let status: "open" | "closed" | "resolved" = "open";
  if (conversation.status === "closed" || conversation.status === "resolved") {
    status = conversation.status;
  } else if (conversation.status === "in_progress") {
    status = "open";
  }

  // Map priority from number to string (Unthread uses numeric priorities)
  let priority: "low" | "medium" | "high" | "urgent" | undefined;
  if (typeof conversation.priority === "number") {
    if (conversation.priority <= 3) {
      priority = "low";
    } else if (conversation.priority <= 6) {
      priority = "medium";
    } else if (conversation.priority <= 8) {
      priority = "high";
    } else {
      priority = "urgent";
    }
  } else if (typeof conversation.priority === "string") {
    priority = conversation.priority.toLowerCase() as
      | "low"
      | "medium"
      | "high"
      | "urgent";
  }

  return {
    assignee: conversation.assignedToUser?.name,
    createdAt: conversation.createdAt,
    customerId: conversation.customer?.id,
    id: conversation.id || conversation.friendlyId || "unknown",
    lastMessage:
      conversation.latestMessage?.content ||
      conversation.initialMessage?.content,
    openedBy:
      conversation.initialMessage?.sentByUser?.name ||
      conversation.customer?.name ||
      "Unknown",
    priority: priority,
    status: status,
    tags: conversation.tags?.map((tag) => tag.name || tag.id) || [],
    title:
      conversation.title || conversation.summary || "Untitled Support Case",
    updatedAt:
      conversation.updatedAt ||
      conversation.lastActivityAt ||
      conversation.createdAt,
  };
}

async function getSupportTickets(userId: string): Promise<SupportTicket[]> {
  // If no API key is configured, return empty array
  if (!UNTHREAD_API_KEY) {
    throw new Error("UNTHREAD_API_KEY is not configured");
  }

  try {
    const url = new URL(
      `${UNTHREAD_BASE_URL}/api/conversations/list?useFullContent=true`,
    );

    // Build the POST payload according to Unthread API spec
    const payload = {
      descending: true,
      includeIntake: false,
      limit: 50,
      order: ["lastActivityAt"],
      select: [
        "id",
        "status",
        "title",
        "createdAt",
        "updatedAt",
        "lastActivityAt",
        "priority",
        "category",
        "assignedToUserId",
        "summary",
        "customer.id",
        "customer.name",
        "assignedToUser.id",
        "assignedToUser.name",
        "initialMessage.content",
        "initialMessage.sentByUser.name",
        "initialMessage.sentByUser.email",
        "latestMessage.content",
        "tags.id",
        "tags.name",
      ],
      where: [
        {
          field: "status",
          operator: "in",
          value: ["open", "in_progress", "closed", "resolved"],
        },
        {
          field: "submitterUserId",
          operator: "in",
          value: [userId],
        },
      ],
    };

    const response = await fetch(url.toString(), {
      body: JSON.stringify(payload),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Api-Key": UNTHREAD_API_KEY,
      },
      method: "POST",
      // Cache for 5 minutes to avoid excessive API calls
      next: { revalidate: 300 },
    } as RequestInit & { next?: { revalidate?: number } });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Unthread API error: ${response.status} - ${errorText}`);
    }

    const data: { data?: UnthreadConversation[] } = await response.json();

    // The Unthread API returns conversations directly in an array or under a 'data' key
    const conversations = data.data || [];

    // Return empty array if no conversations found
    if (conversations.length === 0) {
      return [];
    }

    const mappedTickets = conversations.map(mapUnthreadToSupportTicket);

    return mappedTickets;
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    throw error;
  }
}

export async function getSupportTicketsByTeam(
  userId: string,
): Promise<SupportTicket[]> {
  // If no user ID provided, return mock data for development
  if (!userId) {
    return getMockTickets();
  }

  // Try to fetch real data, fallback to mock data on failure
  try {
    const tickets = await getSupportTickets(userId);
    // If no tickets found, return mock data for development
    if (tickets.length === 0) {
      return getMockTickets();
    }
    return tickets;
  } catch (error) {
    console.error("Failed to fetch real tickets, using mock data:", error);
    return getMockTickets();
  }
}

// Mock tickets for development and fallback
function getMockTickets(): SupportTicket[] {
  return [
    {
      assignee: "Support Team",
      createdAt: "2025-05-15T10:30:00Z",
      customerId: "cust_001",
      id: "1001",
      lastMessage:
        "I'm having trouble integrating the API with my application. The authentication keeps failing even with the correct API key.",
      openedBy: "customer1",
      priority: "high",
      status: "open",
      tags: ["api", "integration", "urgent"],
      title: "API Integration Issue",
      updatedAt: "2025-05-15T14:20:00Z",
    },
    {
      assignee: "Billing Team",
      createdAt: "2025-05-14T09:15:00Z",
      customerId: "cust_002",
      id: "1002",
      lastMessage:
        "Thank you for clarifying the billing cycle. My question has been resolved.",
      openedBy: "customer2",
      priority: "medium",
      status: "closed",
      tags: ["billing", "resolved"],
      title: "Billing Question",
      updatedAt: "2025-05-14T16:45:00Z",
    },
  ];
}

export async function getSupportTicket(
  ticketId: string,
): Promise<SupportTicket | null> {
  // If no API key is configured, throw error
  if (!UNTHREAD_API_KEY) {
    throw new Error("UNTHREAD_API_KEY is not configured");
  }

  try {
    // Fetch conversation details and messages in parallel
    const [conversationResponse, messagesResponse] = await Promise.all([
      fetch(`${UNTHREAD_BASE_URL}/api/conversations/${ticketId}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Api-Key": UNTHREAD_API_KEY,
        },
        method: "GET",
        // Cache for 2 minutes for individual tickets
        next: { revalidate: 120 },
      } as RequestInit & { next?: { revalidate?: number } }),
      fetch(
        `${UNTHREAD_BASE_URL}/api/conversations/${ticketId}/messages/list`,
        {
          body: JSON.stringify({
            descending: false,
            order: ["timestamp"], // Get messages in chronological order
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Api-Key": UNTHREAD_API_KEY,
          },
          method: "POST",
          // Cache for 1 minute for messages
          next: { revalidate: 60 },
        } as RequestInit & { next?: { revalidate?: number } },
      ),
    ]);

    if (!conversationResponse.ok) {
      if (conversationResponse.status === 404) {
        return null; // Ticket not found
      }
      const errorText = await conversationResponse.text();
      throw new Error(
        `Unthread API error: ${conversationResponse.status} - ${errorText}`,
      );
    }

    const conversation: UnthreadConversation =
      await conversationResponse.json();
    const mappedTicket = mapUnthreadToSupportTicket(conversation);

    // Fetch and map messages if the messages request was successful
    if (messagesResponse.ok) {
      const messagesData: { data?: unknown[] } = await messagesResponse.json();
      const messages = messagesData.data || [];

      mappedTicket.messages = messages.map((msg) =>
        mapUnthreadMessage(msg as Parameters<typeof mapUnthreadMessage>[0]),
      );
    }

    return mappedTicket;
  } catch (error) {
    console.error(`Error fetching support ticket ${ticketId}:`, error);
    throw error;
  }
}

export async function createSupportTicket(
  request: CreateSupportTicketRequest,
): Promise<SupportTicket> {
  // If no API key is configured, throw error
  if (!UNTHREAD_API_KEY) {
    throw new Error("UNTHREAD_API_KEY is not configured");
  }

  // Validate required environment variables
  if (!UNTHREAD_EMAIL_INBOX_ID) {
    throw new Error("UNTHREAD_EMAIL_INBOX_ID is not configured");
  }

  if (!UNTHREAD_TRIAGE_CHANNEL_ID) {
    throw new Error("UNTHREAD_TRIAGE_CHANNEL_ID is not configured");
  }

  // Map plan to customer ID
  const customerId = PLAN_TO_CUSTOMER_ID_MAP[request.plan];
  if (!customerId) {
    throw new Error(`Invalid plan: ${request.plan}`);
  }

  try {
    const apiUrl = `${UNTHREAD_BASE_URL}/api/conversations`;

    // Build the payload for creating a conversation
    const payload: CreateConversationPayload = {
      body: {
        type: "markdown",
        value: request.message,
      },
      customerId: customerId,
      emailInboxId: UNTHREAD_EMAIL_INBOX_ID,
      onBehalfOf: {
        email: request.onBehalfOf.email,
        id: request.onBehalfOf.userId,
        name: request.onBehalfOf.name,
        userId: request.onBehalfOf.userId,
      },
      status: "open",
      title: request.title,
      triageChannelId: UNTHREAD_TRIAGE_CHANNEL_ID,
      type: "email",
    };

    let body: string | FormData;
    const headers: Record<string, string> = {
      Accept: "application/json",
      "X-Api-Key": UNTHREAD_API_KEY,
    };

    // Handle file attachments
    if (request.attachments && request.attachments.length > 0) {
      const formData = new FormData();
      formData.append("json", JSON.stringify(payload));

      for (const file of request.attachments) {
        formData.append("attachments", file);
      }

      body = formData;
      // Don't set Content-Type for FormData, browser will set it with boundary
    } else {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(apiUrl, {
      body,
      headers,
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Unthread API error: ${response.status} - ${errorText}`);
    }

    const createdConversation = await response.json();
    // Map the created conversation to our SupportTicket format
    const mappedTicket = mapUnthreadToSupportTicket(createdConversation);

    return mappedTicket;
  } catch (error) {
    console.error("Error creating support ticket:", error);
    throw error;
  }
}

export async function sendMessageToTicket(
  request: SendMessageRequest,
): Promise<void> {
  // If no API key is configured, throw error
  if (!UNTHREAD_API_KEY) {
    throw new Error("UNTHREAD_API_KEY is not configured");
  }

  try {
    const apiUrl = `${UNTHREAD_BASE_URL}/api/conversations/${request.ticketId}/messages`;

    // Build the payload for sending a message
    const payload: SendMessagePayload = {
      body: {
        type: "markdown",
        value: request.message,
      },
      onBehalfOf: request.onBehalfOf,
    };

    let body: string | FormData;
    const headers: Record<string, string> = {
      Accept: "application/json",
      "X-Api-Key": UNTHREAD_API_KEY,
    };

    // Handle file attachments
    if (request.attachments && request.attachments.length > 0) {
      const formData = new FormData();
      formData.append("json", JSON.stringify(payload));

      for (const file of request.attachments) {
        formData.append("attachments", file);
      }

      body = formData;
      // Don't set Content-Type for FormData, browser will set it with boundary
    } else {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(apiUrl, {
      body,
      headers,
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Unthread API error: ${response.status} - ${errorText}`);
    }

    // Message sent successfully, no need to return anything
  } catch (error) {
    console.error(
      `Error sending message to ticket ${request.ticketId}:`,
      error,
    );
    throw error;
  }
}
