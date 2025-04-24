"use server";
import "server-only";

import { getTeamById } from "@/api/team";
import { getUnthreadConversation } from "lib/unthread/get-conversation";
import { getRawAccount } from "../../../../account/settings/getAccount";
import { loginRedirect } from "../../../../login/loginRedirect";

type UpdateTicketResponse =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
    };

export async function updateTicketAction(args: {
  teamId: string;
  conversationId: string;
  updateData: Partial<{
    status: "closed";
  }>;
}): Promise<UpdateTicketResponse> {
  const { teamId, conversationId, updateData } = args;
  if (!teamId || !conversationId) {
    return {
      success: false,
      message: "Missing required arguments.",
    };
  }

  if (updateData.status) {
    // Only allow closing a ticket.
    if (updateData.status !== "closed") {
      return {
        success: false,
        message: 'Invalid "status".',
      };
    }
  }

  const account = await getRawAccount();
  if (!account) {
    // User is not logged in.
    loginRedirect("/support");
  }

  const team = await getTeamById(teamId);
  const customerId = team?.unthreadCustomerId;
  if (!customerId) {
    return {
      success: false,
      message: `Support customer for team ${teamId} not found.`,
    };
  }

  if (
    [
      process.env.UNTHREAD_FREE_TIER_ID,
      process.env.UNTHREAD_GROWTH_TIER_ID,
      process.env.UNTHREAD_PRO_TIER_ID,
    ].includes(customerId)
  ) {
    // Disallow "shared" legacy customer IDs because this endpoint returns customer-specific data.
    return {
      success: false,
      message: `This endpoint is not supported for legacy customer ID ${customerId}`,
    };
  }

  // Get the conversation first to confirm the user has permissions to update this ticket.
  const conversation = await getUnthreadConversation(conversationId);
  if (!conversation || conversation.customerId !== customerId) {
    return {
      success: false,
      message: "Ticket not found.",
    };
  }

  // Get the conversation and messages.
  const res = await fetch(
    `https://api.unthread.io/api/conversations/${conversationId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.UNTHREAD_API_KEY ?? "",
      },
      body: JSON.stringify(updateData),
    },
  );
  if (!res.ok) {
    console.error(
      "Error updating ticket:",
      res.status,
      res.statusText,
      await res.text(),
    );
    return {
      success: false,
      message: "Error updating tickets. Please try again later.",
    };
  }

  return { success: true };
}
