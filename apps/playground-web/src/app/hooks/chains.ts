"use client";

import { useQuery } from "@tanstack/react-query";
import type { ChainMetadata } from "thirdweb/chains";

async function fetchChainsFromApi() {
  const res = await fetch("https://api.thirdweb.com/v1/chains");
  const json = await res.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  return json.data as ChainMetadata[];
}

export function useAllChainsData() {
  const query = useQuery({
    queryKey: ["all-chains"],
    queryFn: async () => {
      const idToChain = new Map<number, ChainMetadata>();
      const chains = await fetchChainsFromApi();

      for (const c of chains) {
        idToChain.set(c.chainId, c);
      }

      return {
        allChains: chains,
        idToChain,
      };
    },
  });

  return {
    isPending: query.isLoading,
    data: query.data || { allChains: [], idToChain: new Map() },
  };
}
