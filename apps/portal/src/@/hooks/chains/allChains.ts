"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

type StoredChain = {
  chainId: number;
  name: string;
  slug: string;
  nativeCurrency: {
    name: string;
    symbol: string;
  };
  icon?: {
    url: string;
  };
};

type AllChainsStore = {
  allChains: StoredChain[];
  idToChain: Map<number, StoredChain | undefined>;
  nameToChain: Map<string, StoredChain | undefined>;
  slugToChain: Map<string, StoredChain | undefined>;
};

// Mock data for the portal app
const mockChains: StoredChain[] = [
  {
    chainId: 1,
    name: "Ethereum Mainnet",
    slug: "ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
    },
  },
  {
    chainId: 137,
    name: "Polygon",
    slug: "polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
    },
  },
  {
    chainId: 56,
    name: "BNB Smart Chain",
    slug: "binance",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
    },
  },
];

async function fetchChainsFromApi() {
  // Mock implementation for portal app
  // In a real implementation, this would fetch from the API
  return mockChains;
}

export function useAllChainsData(): AllChainsStore {
  const allChainsQuery = useQuery({
    queryFn: () => fetchChainsFromApi(),
    queryKey: ["all-chains"],
  });

  const chains = allChainsQuery.data || [];

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
}
