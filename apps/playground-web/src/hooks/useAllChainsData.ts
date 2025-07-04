"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { ChainMetadata } from "@/lib/types";
import { isProd } from "@/lib/env";

async function fetchChainsFromApi() {
  const domain = isProd ? "api.thirdweb.com" : "api.thirdweb-dev.com";
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

  if (!clientId) {
    throw new Error("NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set");
  }

  const res = await fetch(`https://${domain}/v1/chains`, {
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch chains");
  }

  const json = await res.json();
  if (json.error) {
    throw new Error(json.error.message);
  }

  return json.data as ChainMetadata[];
}

export function useAllChainsData() {
  const allChainsQuery = useQuery({
    queryFn: () => fetchChainsFromApi(),
    queryKey: ["all-chains"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { allChains, idToChain, nameToChain, slugToChain } = useMemo(() => {
    const chains = allChainsQuery.data || [];
    const idToChainMap = new Map<number, ChainMetadata>();
    const nameToChainMap = new Map<string, ChainMetadata>();
    const slugToChainMap = new Map<string, ChainMetadata>();

    for (const chain of chains) {
      idToChainMap.set(chain.chainId, chain);
      nameToChainMap.set(chain.name, chain);
      slugToChainMap.set(chain.slug, chain);
    }

    return {
      allChains: chains,
      idToChain: idToChainMap,
      nameToChain: nameToChainMap,
      slugToChain: slugToChainMap,
    };
  }, [allChainsQuery.data]);

  return {
    allChains,
    idToChain,
    nameToChain,
    slugToChain,
    isLoading: allChainsQuery.isLoading,
    error: allChainsQuery.error,
  };
}
