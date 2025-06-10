"use server";

import "server-only";
import { getAuthToken } from "../../app/(app)/api/lib/getAuthToken";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";

export type AuditLogEntry = {
  who: {
    text: string;
    metadata?: {
      email?: string;
      image?: string;
      wallet?: string;
      clientId?: string;
    };
    type: "user" | "apikey" | "system";
    path?: string;
  };
  what: {
    text: string;
    action: "create" | "update" | "delete";
    path?: string;
    in?: {
      text: string;
      path?: string;
    };
    description?: string;
    resourceType:
      | "team"
      | "project"
      | "team-member"
      | "team-invite"
      | "contract"
      | "secret-key";
  };
  when: string;
};

type AuditLogApiResponse = {
  result: AuditLogEntry[];
  nextCursor?: string;
  hasMore: boolean;
};

export async function getAuditLogs(teamSlug: string, cursor?: string) {
  const authToken = await getAuthToken();
  if (!authToken) {
    throw new Error("No auth token found");
  }
  const url = new URL(
    `/v1/teams/${teamSlug}/audit-log`,
    NEXT_PUBLIC_THIRDWEB_API_HOST,
  );
  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }
  // artifically limit page size to 15 for now
  url.searchParams.set("take", "15");

  const response = await fetch(url, {
    next: {
      // revalidate this query once per 10 seconds (does not need to be more granular than that)
      revalidate: 10,
    },
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    // if the status is 402, the most likely reason is that the team is on a free plan
    if (response.status === 402) {
      return {
        status: "error",
        reason: "higher_plan_required",
      } as const;
    }
    const body = await response.text();
    return {
      status: "error",
      reason: "unknown",
      body,
    } as const;
  }

  const data = (await response.json()) as AuditLogApiResponse;

  return {
    status: "success",
    data,
  } as const;
}
