import { accountCacheTag } from "@/constants/cacheTags";
import { API_SERVER_URL } from "@/constants/env";
import type { UsageBillableByService } from "@3rdweb-sdk/react/hooks/useApi";
import { unstable_cache } from "next/cache";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";

export async function getAccountUsage() {
  const token = await getAuthToken();

  if (!token) {
    return undefined;
  }

  const getCachedAccountUsage = unstable_cache(
    getAccountUsageForAuthToken,
    ["getAccountUsage"],
    {
      tags: [accountCacheTag(token)],
      revalidate: 3600, // 1 hour
    },
  );

  return getCachedAccountUsage(token);
}

async function getAccountUsageForAuthToken(authToken: string) {
  const res = await fetch(`${API_SERVER_URL}/v1/account/usage`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    return undefined;
  }

  const json = await res.json();
  return json.data as UsageBillableByService;
}
