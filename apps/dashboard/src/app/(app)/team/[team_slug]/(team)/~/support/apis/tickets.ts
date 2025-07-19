import "server-only";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type {
  SupportMessage,
  SupportTicket,
  SupportTicketListItem,
} from "../types/tickets";

export async function getSupportTicketsByTeam(params: {
  teamSlug: string;
  authToken: string;
}): Promise<SupportTicketListItem[]> {
  const encodedTeamSlug = encodeURIComponent(params.teamSlug);
  const apiUrl = `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations/list`;

  const response = await fetch(apiUrl, {
    body: JSON.stringify({
      limit: 50,
      descending: true,
    }),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "identity",
      Authorization: `Bearer ${params.authToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch support tickets: ${errorText}`);
  }

  const data: { data?: SupportTicketListItem[] } = await response.json();
  const conversations = data.data || [];
  return conversations;
}

type RawSupportMessage = {
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
};

export async function getSupportTicket(params: {
  ticketId: string;
  teamSlug: string;
  authToken: string;
}): Promise<SupportTicket> {
  const encodedTeamSlug = encodeURIComponent(params.teamSlug);
  const encodedTicketId = encodeURIComponent(params.ticketId);

  const messagesPayload = {
    limit: 1000,
    descending: false,
  };

  const [conversationResponse, messagesResponse] = await Promise.all([
    fetch(
      `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations/${encodedTicketId}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "identity",
          Authorization: `Bearer ${params.authToken}`,
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
          Authorization: `Bearer ${params.authToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    ),
  ]);

  if (!conversationResponse.ok || !messagesResponse.ok) {
    throw new Error(
      `Failed to fetch support ticket: ${await conversationResponse.text()}`,
    );
  }

  const conversation: SupportTicket = await conversationResponse.json();
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

  return conversation;
}
