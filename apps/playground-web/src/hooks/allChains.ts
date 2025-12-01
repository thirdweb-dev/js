"use client";

import { useQuery } from "@tanstack/react-query";
import type { ChainMetadata } from "thirdweb/chains";

async function fetchChainsFromApi() {
  // always fetch from prod for chains for now
  // TODO: re-visit this
  const res = await fetch("https://api.thirdweb.com/v1/chains");
  const json = await res.json();

  if (json.error || !res.ok) {
    throw new Error(
      json.error?.message || `Failed to fetch chains: ${res.status}`,
    );
  }

  return json.data as ChainMetadata[];
}

export function useAllChainsData() {
  // trigger fetching all chains if this hook is used instead of putting this on root
  // so we can avoid fetching all chains if it's not required
  const allChainsQuery = useQuery({
    queryFn: () => fetchChainsFromApi(),
    queryKey: ["all-chains"],
  });

  return allChainsQuery.data;
}
