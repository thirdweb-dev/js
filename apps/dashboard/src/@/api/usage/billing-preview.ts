import "server-only";

import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";

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
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      next: {
        // revalidate this query once per minute (does not need to be more granular than that)
        revalidate: 60,
      },
    },
  );
  if (!response.ok) {
    // if the status is 404, the most likely reason is that the team is on a free plan
    if (response.status === 404) {
      return {
        reason: "free_plan",
        status: "error",
      } as const;
    }
    const body = await response.text();
    return {
      body,
      reason: "unknown",
      status: "error",
    } as const;
  }
  const data = (await response.json()) as UsageApiResponse;
  return {
    data,
    status: "success",
  } as const;
}
