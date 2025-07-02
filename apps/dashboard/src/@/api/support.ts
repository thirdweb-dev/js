"use server";
import "server-only";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getAuthToken } from "./auth-token";

export interface SupportTicket {
  id: string;
  title: string;
  status: "open" | "closed" | "resolved";
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

// Reusable types
interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export interface CreateSupportTicketRequest {
  title: string;
  message: string;
  teamSlug: string;
  onBehalfOf: UserInfo;
  attachments?: File[];
}

export interface SendMessageRequest {
  ticketId: string;
  teamSlug: string;
  message: string;
  onBehalfOf: UserInfo;
  attachments?: File[];
}

export async function getSupportTicketsByTeam(
  teamSlug: string,
  authToken?: string,
): Promise<SupportTicket[]> {
  // If no team slug provided, throw error
  if (!teamSlug) {
    throw new Error("Team slug is required to fetch support tickets");
  }

  const token = authToken || (await getAuthToken());
  if (!token) {
    throw new Error("No auth token available");
  }

  try {
    // URL encode the team slug to handle special characters like #
    const encodedTeamSlug = encodeURIComponent(teamSlug);
    const apiUrl = `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations/list`;

    // Build the POST payload according to API spec
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
        "customer.id",
        "customer.name",
        "assignedToUser.name",
        "initialMessage.content",
        "initialMessage.sentByUser.name",
        "latestMessage.content",
        "tags.name",
      ],
      where: [
        {
          field: "status",
          operator: "in",
          value: ["open", "in_progress", "closed", "resolved"],
        },
      ],
    };

    const response = await fetch(apiUrl, {
      body: JSON.stringify(payload),
      // Disable caching to get real-time data
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Server error: ${response.status} - ${errorText}`);
    }

    const data: { data?: SupportTicket[] } = await response.json();

    // The API returns conversations directly in an array or under a 'data' key
    const conversations = data.data || [];

    // Return empty array if no conversations found
    if (conversations.length === 0) {
      return [];
    }

    return conversations;
  } catch (error) {
    throw error;
  }
}

export async function getSupportTicket(
  ticketId: string,
  teamSlug: string,
  authToken?: string,
): Promise<SupportTicket | null> {
  if (!ticketId || !teamSlug) {
    throw new Error("Ticket ID and team slug are required");
  }

  const token = authToken || (await getAuthToken());
  if (!token) {
    throw new Error("No auth token available");
  }

  try {
    // URL encode the team slug to handle special characters like #
    const encodedTeamSlug = encodeURIComponent(teamSlug);
    const encodedTicketId = encodeURIComponent(ticketId);

    // Fetch conversation details and messages in parallel
    const [conversationResponse, messagesResponse] = await Promise.all([
      fetch(
        `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations/${encodedTicketId}`,
        {
          // Disable caching to get real-time data
          cache: "no-store",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "GET",
        },
      ),
      fetch(
        `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations/${encodedTicketId}/messages`,
        {
          body: JSON.stringify({
            descending: false,
            order: ["timestamp"], // Get messages in chronological order
          }),
          // Disable caching to get real-time data
          cache: "no-store",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        },
      ),
    ]);

    if (!conversationResponse.ok) {
      if (conversationResponse.status === 404) {
        return null; // Ticket not found
      }
      const errorText = await conversationResponse.text();
      throw new Error(
        `API Server error: ${conversationResponse.status} - ${errorText}`,
      );
    }

    const conversation: SupportTicket = await conversationResponse.json();

    // Fetch and map messages if the messages request was successful
    if (messagesResponse.ok) {
      const messagesData: { data?: SupportMessage[] } =
        await messagesResponse.json();
      const messages = messagesData.data || [];
      conversation.messages = messages;
    } else {
      // Don't throw error, just leave messages empty
      conversation.messages = [];
    }

    return conversation;
  } catch (error) {
    throw error;
  }
}

export async function createSupportTicket(
  request: CreateSupportTicketRequest,
): Promise<SupportTicket> {
  if (!request.teamSlug) {
    throw new Error("Team slug is required to create support ticket");
  }

  const token = await getAuthToken();
  if (!token) {
    throw new Error("No auth token available");
  }

  try {
    // URL encode the team slug to handle special characters like #
    const encodedTeamSlug = encodeURIComponent(request.teamSlug);
    const apiUrl = `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations`;

    // Build the payload for creating a conversation
    const payload = {
      markdown: request.message.trim(),
      onBehalfOf: request.onBehalfOf,
      status: "open",
      title: request.title,
      type: "email",
    };

    let body: string | FormData;
    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
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
      throw new Error(`API Server error: ${response.status} - ${errorText}`);
    }

    const createdConversation: SupportTicket = await response.json();
    return createdConversation;
  } catch (error) {
    throw error;
  }
}

export async function sendMessageToTicket(
  request: SendMessageRequest,
): Promise<void> {
  if (!request.ticketId || !request.teamSlug) {
    throw new Error("Ticket ID and team slug are required");
  }

  const token = await getAuthToken();
  if (!token) {
    throw new Error("No auth token available");
  }

  try {
    // URL encode the team slug and ticket ID to handle special characters like #
    const encodedTeamSlug = encodeURIComponent(request.teamSlug);
    const encodedTicketId = encodeURIComponent(request.ticketId);
    const apiUrl = `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations/${encodedTicketId}/messages`;

    // Build the payload for sending a message
    // Add /unthread send at the end to ensure the message is sent to the customer
    const messageWithSend = `${request.message.trim()}\n\n/unthread send`;

    const payload = {
      body: {
        type: "markdown",
        value: messageWithSend,
      },
      onBehalfOf: request.onBehalfOf,
    };

    let body: string | FormData;
    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
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
      throw new Error(`API Server error: ${response.status} - ${errorText}`);
    }

    // Message sent successfully, no need to return anything
  } catch (error) {
    throw error;
  }
}
