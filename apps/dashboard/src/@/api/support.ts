"use server";
import "server-only";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getAuthToken, getAuthTokenWalletAddress } from "./auth-token";

export interface SupportTicket {
  id: string;
  status: "needs_response" | "in_progress" | "on_hold" | "closed" | "resolved";
  createdAt: string;
  updatedAt: string;
  messages?: SupportMessage[];
}

interface SupportMessage {
  id: string;
  content: string;
  createdAt: string;
  timestamp: string;
  author?: {
    name: string;
    email: string;
    type: "user" | "customer";
  };
}

interface CreateSupportTicketRequest {
  message: string;
  teamSlug: string;
  title: string;
}

interface SendMessageRequest {
  ticketId: string;
  teamSlug: string;
  message: string;
}

export async function getSupportTicketsByTeam(
  teamSlug: string,
  authToken?: string,
): Promise<SupportTicket[]> {
  if (!teamSlug) {
    throw new Error("Team slug is required to fetch support tickets");
  }

  const token = authToken || (await getAuthToken());
  if (!token) {
    throw new Error("No auth token available");
  }

  // URL encode the team slug to handle special characters like #
  const encodedTeamSlug = encodeURIComponent(teamSlug);
  const apiUrl = `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations/list`;

  // Build the POST payload according to API spec
  const payload = {
    limit: 50,
    descending: true,
  };

  const response = await fetch(apiUrl, {
    body: JSON.stringify(payload),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "identity",
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
  const conversations = data.data || [];
  return conversations;
}

interface RawSupportMessage {
  id: string;
  text?: string;
  timestamp?: string;
  createdAt?: string;
  isPrivateNote?: boolean;
  sentByUser?: {
    name: string;
    email: string;
    isExternal: boolean;
  };
  // Add any other fields you use from the API
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

  // URL encode the team slug to handle special characters like #
  const encodedTeamSlug = encodeURIComponent(teamSlug);
  const encodedTicketId = encodeURIComponent(ticketId);

  const messagesPayload = {
    limit: 100,
    descending: false,
  };

  // Fetch conversation details and messages in parallel
  const [conversationResponse, messagesResponse] = await Promise.all([
    fetch(
      `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations/${encodedTicketId}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "identity",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      },
    ),
    fetch(
      `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations/${encodedTicketId}/messages/list`,
      {
        body: JSON.stringify(messagesPayload),
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "identity",
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
    const messagesData: { data?: unknown[] } = await messagesResponse.json();
    const rawMessages = messagesData.data || [];
    // Transform the raw messages to match our interface
    const messages: SupportMessage[] = (rawMessages as RawSupportMessage[])
      .filter((msg) => {
        // Filter out messages without content - check both text and text fields
        const hasContent = msg.text && msg.text.length > 0;
        const hasText = msg.text && msg.text.trim().length > 0;
        // Filter out private notes - they should not be shown to customers
        const isNotPrivateNote = !msg.isPrivateNote;
        return (hasContent || hasText) && isNotPrivateNote;
      })
      .map((msg) => {
        // Use text if available and is a non-empty array, otherwise fall back to text
        let content = "";
        if (typeof msg.text === "string" && msg.text.trim().length > 0) {
          content = msg.text;
        }

        // Clean up 'Email:' line to show only the plain email if it contains a mailto link
        if (content) {
          content = content
            .split("\n")
            .map((line) => {
              if (line.trim().toLowerCase().startsWith("email:")) {
                // Extract email from <mailto:...|...>
                const match = line.match(/<mailto:([^|>]+)\|[^>]+>/);
                if (match) {
                  return `Email: ${match[1]}`;
                }
              }
              return line;
            })
            .join("\n");
        }

        // Map the author information from sentByUser if available
        const author = msg.sentByUser
          ? {
              name: msg.sentByUser.name,
              email: msg.sentByUser.email,
              type: (msg.sentByUser.isExternal ? "customer" : "user") as
                | "user"
                | "customer",
            }
          : undefined;

        return {
          id: msg.id,
          content: content,
          createdAt: msg.timestamp || msg.createdAt || "",
          timestamp: msg.timestamp || msg.createdAt || "",
          author: author,
        };
      });

    conversation.messages = messages;
  } else {
    // Don't throw error, just leave messages empty
    const _errorText = await messagesResponse.text();
    conversation.messages = [];
  }

  return conversation;
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

  // Fetch wallet address (server-side)
  const walletAddress = await getAuthTokenWalletAddress();

  // URL encode the team slug to handle special characters like #
  const encodedTeamSlug = encodeURIComponent(request.teamSlug);
  const apiUrl = `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations`;

  // Build the payload for creating a conversation
  // If the message does not already include wallet address, prepend it
  let message = request.message;
  if (!message.includes("Wallet address:")) {
    message = `Wallet address: ${String(walletAddress || "-")}\n${message}`;
  }

  const payload = {
    markdown: message.trim(),
    title: request.title,
  };

  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept-Encoding": "identity",
  };

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

  // URL encode the team slug and ticket ID to handle special characters like #
  const encodedTeamSlug = encodeURIComponent(request.teamSlug);
  const encodedTicketId = encodeURIComponent(request.ticketId);
  const apiUrl = `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations/${encodedTicketId}/messages`;

  // Build the payload for sending a message
  // Append /unthread send for customer messages to ensure proper routing
  const messageWithUnthread = `${request.message.trim()}\n/unthread send`;
  const payload = {
    markdown: messageWithUnthread,
  };

  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept-Encoding": "identity",
  };

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
}
