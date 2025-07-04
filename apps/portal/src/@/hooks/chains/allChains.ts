"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type ChainMetadata = {
  chainId: number;
  name: string;
  slug: string;
  rpc: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  icon?: {
    url: string;
  };
  explorers?: Array<{
    name: string;
    url: string;
    standard: string;
  }>;
  testnet?: boolean;
};

type StoredChain = ChainMetadata;

type AllChainsStore = {
  allChains: StoredChain[];
  idToChain: Map<number, StoredChain | undefined>;
  nameToChain: Map<string, StoredChain | undefined>;
  slugToChain: Map<string, StoredChain | undefined>;
};

// Fetch chains from the real API
async function fetchChainsFromApi() {
  const res = await fetch("https://api.thirdweb.com/v1/chains");
  const json = await res.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  return json.data as ChainMetadata[];
}

export function useAllChainsData() {
  const chainsQuery = useQuery({
    queryKey: ["all-chains"],
    queryFn: fetchChainsFromApi,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  const allChainsStore = useMemo((): AllChainsStore => {
    const chains = chainsQuery.data || [];
    const idToChain = new Map<number, StoredChain | undefined>();
    const nameToChain = new Map<string, StoredChain | undefined>();
    const slugToChain = new Map<string, StoredChain | undefined>();

    for (const chain of chains) {
      idToChain.set(chain.chainId, chain);
      nameToChain.set(chain.name, chain);
      slugToChain.set(chain.slug, chain);
    }

    return {
      allChains: chains,
      idToChain,
      nameToChain,
      slugToChain,
    };
  }, [chainsQuery.data]);

  return {
    ...allChainsStore,
    isLoading: chainsQuery.isPending,
    isError: chainsQuery.isError,
    error: chainsQuery.error,
  };
}
