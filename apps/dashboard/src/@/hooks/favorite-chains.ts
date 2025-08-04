"use client";

import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";
import { apiServerProxy } from "@/actions/proxies";

async function favoriteChains() {
  const res = await apiServerProxy<{ data: string[] }>({
    method: "GET",
    pathname: "/v1/chains/favorites",
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  const result = res.data;
  return result.data ?? [];
}

export function useFavoriteChainIds() {
  const address = useActiveAccount()?.address;
  return useQuery({
    enabled: !!address,
    queryFn: () => favoriteChains(),
    queryKey: ["favoriteChains", address],
  });
}
