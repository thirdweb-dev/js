"use client";

import { useQuery } from "@tanstack/react-query";
import type { TokenMetadata } from "@/lib/types";
import { isProd } from "@/lib/env";

async function fetchTokensFromApi(chainId?: number) {
  const domain = isProd ? "bridge.thirdweb.com" : "bridge.thirdweb-dev.com";
  const url = new URL(`https://${domain}/v1/tokens`);

  if (chainId) {
    url.searchParams.append("chainId", String(chainId));
  }
  url.searchParams.append("limit", "1000");

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tokens");
  }

  const json = await res.json();
  if (json.error) {
    throw new Error(json.error.message);
  }

  return json.data as Array<TokenMetadata>;
}

export function useTokensData({
  chainId,
  enabled = true,
}: {
  chainId?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryFn: () => fetchTokensFromApi(chainId),
    queryKey: ["tokens", chainId],
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled,
  });
}
