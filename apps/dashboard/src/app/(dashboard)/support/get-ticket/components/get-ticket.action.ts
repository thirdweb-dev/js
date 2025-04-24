"use server";
import "server-only";

import { getTeamById } from "@/api/team";
import { getUnthreadConversation } from "lib/unthread/get-conversation";
import { getRawAccount } from "../../../../account/settings/getAccount";
import { loginRedirect } from "../../../../login/loginRedirect";

type GetTicketResponse =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      result: UnthreadMessagesResponse;
    };

interface UnthreadMessage {
  ts: string;
  botId: string;
  botName: string;
  timestamp: string;
  threadTs: string;
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    photo?: string;
  } | null;
  conversation: {
    customerId: string;
  };
  resolvedContent: (
    | string
    | {
        type: "link";
        id: string;
        name: string;
      }
  )[];
  text: string;
  htmlContent: string;
}

interface UnthreadMessagesResponse {
  data: UnthreadMessage[];
  totalCount: number;
  cursors: {
    hasNext: boolean;
    hasPrevious: boolean;
    next?: string;
    previous?: string;
  };
}

export async function getTicketAction(args: {
  teamId: string;
  conversationId: string;
  cursor?: string;
}): Promise<GetTicketResponse> {
  const { teamId, conversationId, cursor = "" } = args;
  if (!teamId || !conversationId) {
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
    `https://api.unthread.io/api/conversations/${conversationId}/messages/list`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.UNTHREAD_API_KEY ?? "",
      },
      body: JSON.stringify({
        select: [
          "ts",
          "botId",
          "botName",
          "text",
          "timestamp",
          "threadTs",
          "metadata",
          "user.id",
          "user.name",
          "user.email",
          "user.slackId",
          "user.photo",
        ],
        order: ["ts"],
        descending: true,
        limit: 100,
        cursor,
      }),
    },
  );
  if (!res.ok) {
    console.error(
      "Error retrieving ticket:",
      res.status,
      res.statusText,
      await res.text(),
    );
    return {
      success: false,
      message: "Error retrieving ticket. Please try again later.",
    };
  }

  const json = (await res.json()) as UnthreadMessagesResponse;

  return {
    success: true,
    result: json,
  };
}
