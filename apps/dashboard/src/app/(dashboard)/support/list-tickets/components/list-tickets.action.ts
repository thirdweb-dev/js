"use server";
import "server-only";

import { getTeamById } from "@/api/team";
import { getRawAccount } from "../../../../account/settings/getAccount";
import { loginRedirect } from "../../../../login/loginRedirect";

type ListTicketsResponse =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      result: UnthreadConversationsResponse;
    };

interface UnthreadConversation {
  title: string;
  createdAt: string;
  id: string;
  initialMessage: {
    ts: string;
    text: string;
  };
  tags: { name: string }[];
  customerId: string;
  titleOverwritten: boolean;
  resolvedTitle: string[];
}

interface UnthreadConversationsResponse {
  data: UnthreadConversation[];
  totalCount: number;
  cursors: {
    hasNext: boolean;
    hasPrevious: boolean;
    next?: string;
    previous?: string;
  };
}

export async function listTicketsAction(args: {
  teamId: string;
  cursor?: string;
}): Promise<ListTicketsResponse> {
  const { teamId, cursor = "" } = args;
  if (!teamId) {
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

  // Get the conversation and messages.
  const res = await fetch("https://api.unthread.io/api/conversations/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.UNTHREAD_API_KEY ?? "",
    },
    body: JSON.stringify({
      select: [
        "id",
        "title",
        "initialMessage.ts",
        "initialMessage.text",
        "tags.name",
        "customerId",
      ],
      order: ["createdAt"],
      where: [
        {
          field: "customerId",
          operator: "==",
          value: customerId,
        },
      ],
      descending: true,
      limit: 100,
      cursor,
    }),
  });
  if (!res.ok) {
    console.error(
      "Error listing tickets:",
      res.status,
      res.statusText,
      await res.text(),
    );
    return {
      success: false,
      message: "Error listing tickets. Please try again later.",
    };
  }

  const json = (await res.json()) as UnthreadConversationsResponse;
  return {
    success: true,
    result: json,
  };
}
