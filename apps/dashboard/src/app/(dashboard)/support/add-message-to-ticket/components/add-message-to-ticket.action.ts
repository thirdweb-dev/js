"use server";
import "server-only";

import { getTeamById } from "@/api/team";
import { getUnthreadConversation } from "lib/unthread/get-conversation";
import { getRawAccount } from "../../../../account/settings/getAccount";
import { loginRedirect } from "../../../../login/loginRedirect";

type AddMessageToTicketResponse =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
    };

export async function addMessageToTicketAction(args: {
  teamId: string;
  conversationId: string;
  messageMarkdown: string;
}): Promise<AddMessageToTicketResponse> {
  const { teamId, conversationId, messageMarkdown } = args;
  if (!teamId || !conversationId || !messageMarkdown) {
    return {
      success: false,
      message: "Missing required arguments.",
    };
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
    `https://api.unthread.io/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.UNTHREAD_API_KEY ?? "",
      },
      body: JSON.stringify({
        body: {
          type: "markdown",
          value: messageMarkdown,
        },
        onBehalfOf: {
          email: account.email,
          name: account.name,
          id: customerId,
        },
      }),
    },
  );
  if (!res.ok) {
    console.error(
      "Error adding message to the ticket:",
      res.status,
      res.statusText,
      await res.text(),
    );
    return {
      success: false,
      message: "Error adding message to the ticket. Please try again later.",
    };
  }

  return { success: true };
}
