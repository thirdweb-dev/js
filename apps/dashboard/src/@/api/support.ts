"use server";
import "server-only";

// UNTHREAD_API_KEY is used as Bearer token
const UNTHREAD_API_KEY = process.env.UNTHREAD_API_KEY || "";
const UNTHREAD_BASE_URL = process.env.UNTHREAD_BASE_URL || "https://thirdweb.unthread.io";

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
}

export interface UnthreadConversation {
  id: string;
  title: string;
  status: string;
  priority?: string;
  createdAt: string;
  updatedAt: string;
  customerId?: string;
  tags?: string[];
  assignee?: {
    name: string;
    email: string;
  };
  lastMessage?: {
    content: string;
    author: {
      name: string;
      email: string;
    };
  };
  onBehalfOf?: {
    name: string;
    email: string;
    id: string;
  };
}

// Fallback mock data for development/testing
const mockSupportTickets: SupportTicket[] = [
  {
    id: "328976",
    title: "API Integration Issue",
    status: "open",
    priority: "high",
    openedBy: "JohnDev",
    createdAt: "2025-02-15T10:38:00Z",
    updatedAt: "2025-02-16T14:22:00Z",
    lastMessage:
      "Our app fails to fetch data from the API after recent updates. Getting 403 errors consistently.",
    tags: ["api", "integration", "error"],
  },
  {
    id: "329042",
    title: "Billing Cycle Question",
    status: "open",
    priority: "medium",
    openedBy: "EmilyTech",
    createdAt: "2025-02-17T15:10:00Z",
    updatedAt: "2025-02-17T15:10:00Z",
    lastMessage:
      "Could you clarify when the billing cycle resets for our plan? I'm not sure if we're charged monthly or annually.",
    tags: ["billing", "question"],
  },
  {
    id: "328915",
    title: "Dashboard Access Issue",
    status: "resolved",
    priority: "low",
    openedBy: "AlexUser",
    createdAt: "2025-02-10T08:30:00Z",
    updatedAt: "2025-02-14T16:45:00Z",
    assignee: "Support Team",
    lastMessage: "Issue resolved. User permissions have been updated.",
    tags: ["dashboard", "access", "resolved"],
  },
  {
    id: "330012",
    title: "SDK Documentation Request",
    status: "open",
    priority: "low",
    openedBy: "DevUser123",
    createdAt: "2025-02-18T09:15:00Z",
    updatedAt: "2025-02-18T09:15:00Z",
    lastMessage:
      "Could you provide more examples for the new SDK features? The current docs are lacking.",
    tags: ["documentation", "sdk"],
  },
];

function mapUnthreadToSupportTicket(
  conversation: any,
): SupportTicket {
  // Map status values from Unthread to our expected format
  let status: "open" | "closed" | "resolved" = "open";
  if (conversation.status === "closed" || conversation.status === "resolved") {
    status = conversation.status;
  } else if (conversation.status === "in_progress") {
    status = "open";
  }

  // Map priority from number to string (Unthread uses numeric priorities)
  let priority: "low" | "medium" | "high" | "urgent" | undefined = undefined;
  if (typeof conversation.priority === 'number') {
    if (conversation.priority <= 3) {
      priority = "low";
    } else if (conversation.priority <= 6) {
      priority = "medium";
    } else if (conversation.priority <= 8) {
      priority = "high";
    } else {
      priority = "urgent";
    }
  } else if (typeof conversation.priority === 'string') {
    priority = conversation.priority.toLowerCase() as "low" | "medium" | "high" | "urgent";
  }

  return {
    id: conversation.id || conversation.friendlyId || "unknown",
    title: conversation.title || conversation.summary || "Untitled Support Case",
    status: status,
    priority: priority,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt || conversation.lastActivityAt,
    openedBy:
      conversation.initialMessage?.sentByUser?.name ||
      conversation.customer?.name ||
      "Unknown",
    customerId: conversation.customer?.id,
    tags: conversation.tags?.map((tag: any) => tag.name || tag.id) || [],
    assignee: conversation.assignedToUser?.name,
    lastMessage: conversation.latestMessage?.content || conversation.initialMessage?.content,
  };
}

export async function getSupportTickets(
  customerId?: string,
): Promise<SupportTicket[]> {
  // If no API key is configured, return mock data for development
  if (!UNTHREAD_API_KEY) {
    return mockSupportTickets;
  }

  try {
    const url = new URL(`${UNTHREAD_BASE_URL}/api/conversations/list?useFullContent=true`);

    // Build the POST payload according to Unthread API spec
    const payload = {
      limit: 50,
      order: ["lastActivityAt"],
      descending: true,
      select: [
        "id", "status", "title", "createdAt", "updatedAt", "lastActivityAt",
        "priority", "category", "assignedToUserId", "summary",
        "customer.id", "customer.name", "assignedToUser.id", "assignedToUser.name",
        "initialMessage.content", "initialMessage.sentByUser.name", "initialMessage.sentByUser.email",
        "latestMessage.content", "tags.id", "tags.name"
      ],
      includeIntake: false,
      where: [
        {
          field: "status",
          operator: "in", 
          value: ["open", "in_progress", "closed", "resolved"]
        }
      ]
    };

    // Add customerId filter if provided
    if (customerId) {
      payload.where.push({
        field: "customerId",
        operator: "in",
        value: [customerId]
      });
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "X-Api-Key": UNTHREAD_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
      // Cache for 5 minutes to avoid excessive API calls
      next: { revalidate: 300 },
    } as RequestInit & { next?: { revalidate?: number } });

    if (!response.ok) {
      return mockSupportTickets;
    }

    const data = await response.json();

    // The Unthread API returns conversations directly in an array or under a 'data' key
    const conversations = data.data || data || [];

    // If no conversations returned, fallback to mock data
    if (!conversations || conversations.length === 0) {
      return mockSupportTickets;
    }

    const mappedTickets = conversations.map((conv: any) => mapUnthreadToSupportTicket(conv));

    return mappedTickets;
  } catch (error) {
    return mockSupportTickets;
  }
}

export async function getSupportTicketsByTeam(
  teamId: string,
): Promise<SupportTicket[]> {
  // TODO: Map teamId to customerId for proper filtering
  // For now, since we don't have a customerId, return mock data for UI testing
  // This prevents showing all tickets from all customers while still showing the UI
  
  // In a real implementation, you'd do something like:
  // const customerId = await getCustomerIdForTeam(teamId);
  // if (!customerId) return [];
  // return getSupportTickets(customerId);
  
  // For now, return mock data to test the UI
  return mockSupportTickets;
}

export async function getSupportTicket(
  ticketId: string,
): Promise<SupportTicket | null> {
  // If no API key is configured, check mock data
  if (!UNTHREAD_API_KEY) {
    const mockTicket = mockSupportTickets.find((ticket) => ticket.id === ticketId);
    return mockTicket || null;
  }

  try {
    const apiUrl = `${UNTHREAD_BASE_URL}/api/conversations/${ticketId}`;
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-Api-Key": UNTHREAD_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      // Cache for 2 minutes for individual tickets
      next: { revalidate: 120 },
    } as RequestInit & { next?: { revalidate?: number } });

    if (!response.ok) {
      // Fallback to mock data
      const mockTicket = mockSupportTickets.find((ticket) => ticket.id === ticketId);
      return mockTicket || null;
    }

    const conversation: any = await response.json();
    
    const mappedTicket = mapUnthreadToSupportTicket(conversation);
    
    return mappedTicket;
  } catch (error) {
    // Fallback to mock data
    const mockTicket = mockSupportTickets.find((ticket) => ticket.id === ticketId);
    return mockTicket || null;
  }
}
