"use server";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { SupportTicket } from "../../app/(app)/team/[team_slug]/(team)/~/support/types/tickets";
import { getAuthToken, getAuthTokenWalletAddress } from "./auth-token";

const ESCALATION_FEEDBACK_RATING = 9999;

export async function createSupportTicket(params: {
  message: string;
  teamSlug: string;
  teamId: string;
  title: string;
  conversationId?: string;
}): Promise<{ data: SupportTicket } | { error: string }> {
  const token = await getAuthToken();
  if (!token) {
    return { error: "No auth token available" };
  }

  try {
    const walletAddress = await getAuthTokenWalletAddress();

    const encodedTeamSlug = encodeURIComponent(params.teamSlug);
    const apiUrl = `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations`;

    // Build the payload for creating a conversation
    // If the message does not already include wallet address, prepend it
    let message = params.message;
    if (!message.includes("Wallet address:")) {
      message = `Wallet address: ${String(walletAddress || "-")}\n${message}`;
    }

    const payload = {
      markdown: message.trim(),
      title: params.title,
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
      return { error: `API Server error: ${response.status} - ${errorText}` };
    }

    const createdConversation: SupportTicket = await response.json();

    // Escalate to SIWA feedback endpoint if conversationId is provided
    if (params.conversationId) {
      try {
        const siwaUrl = process.env.NEXT_PUBLIC_SIWA_URL;
        if (siwaUrl) {
          const res = await fetch(`${siwaUrl}/v1/chat/feedback`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              ...(params.teamId ? { "x-team-id": params.teamId } : {}),
            },
            body: JSON.stringify({
              conversationId: params.conversationId,
              feedbackRating: ESCALATION_FEEDBACK_RATING,
            }),
          });

          if (!res.ok) {
            // Log error but don't fail the ticket creation
            const errorMessage = await res.text();
            console.error("Failed to escalate to SIWA feedback:", errorMessage);
          }
        }
      } catch (error) {
        // Log error but don't fail the ticket creation
        console.error("Failed to escalate to SIWA feedback:", error);
      }
    }

    return { data: createdConversation };
  } catch (error) {
    return {
      error: `Failed to create support ticket: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function sendMessageToTicket(request: {
  ticketId: string;
  teamSlug: string;
  teamId: string;
  message: string;
}): Promise<{ success: true } | { error: string }> {
  if (!request.ticketId || !request.teamSlug) {
    return { error: "Ticket ID and team slug are required" };
  }

  const token = await getAuthToken();
  if (!token) {
    return { error: "No auth token available" };
  }

  try {
    const encodedTeamSlug = encodeURIComponent(request.teamSlug);
    const encodedTicketId = encodeURIComponent(request.ticketId);
    const apiUrl = `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/teams/${encodedTeamSlug}/support-conversations/${encodedTicketId}/messages`;

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
      ...(request.teamId ? { "x-team-id": request.teamId } : {}),
    };

    const response = await fetch(apiUrl, {
      body,
      headers,
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `API Server error: ${response.status} - ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    return {
      error: `Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
