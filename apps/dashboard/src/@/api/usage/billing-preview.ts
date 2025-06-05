import "server-only";

import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import { getAuthToken } from "../../../app/(app)/api/lib/getAuthToken";

type LineItem = {
  quantity: number;
  amountUsdCents: number;
  unitAmountUsdCents: string;
  description: string;
};

export type UsageCategory = {
  category: string;
  unitName: string;
  lineItems: LineItem[];
};

type UsageApiResponse = {
  result: UsageCategory[];
  periodStart: string;
  periodEnd: string;
  planVersion: number;
};

export async function getBilledUsage(teamSlug: string) {
  const authToken = await getAuthToken();
  if (!authToken) {
    throw new Error("No auth token found");
  }
  const response = await fetch(
    new URL(
      `/v1/teams/${teamSlug}/billing/billed-usage`,
      NEXT_PUBLIC_THIRDWEB_API_HOST,
    ),
    {
      next: {
        // revalidate this query once per minute (does not need to be more granular than that)
        revalidate: 60,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  if (!response.ok) {
    // if the status is 404, the most likely reason is that the team is on a free plan
    if (response.status === 404) {
      return {
        status: "error",
        reason: "free_plan",
      } as const;
    }
    const body = await response.text();
    return {
      status: "error",
      reason: "unknown",
      body,
    } as const;
  }
  const data = (await response.json()) as UsageApiResponse;
  return {
    status: "success",
    data,
  } as const;
}
