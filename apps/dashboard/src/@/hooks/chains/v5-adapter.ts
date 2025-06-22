"use client";

import { useMemo } from "react";
import type { Chain, ChainMetadata } from "thirdweb/chains";
import { useActiveWalletChain } from "thirdweb/react";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { defineDashboardChain } from "@/lib/defineDashboardChain";

export function useV5DashboardChain(chainId: undefined): undefined;
export function useV5DashboardChain(chainId: number): Chain;
export function useV5DashboardChain(
  chainId: number | undefined,
): Chain | undefined;
export function useV5DashboardChain(
  chainId: number | undefined,
): Chain | undefined {
  const { idToChain } = useAllChainsData();

  // memo is very very important!
  return useMemo(() => {
    if (chainId === undefined) {
      return undefined;
    }

    // eslint-disable-next-line no-restricted-syntax
    return defineDashboardChain(chainId, idToChain.get(chainId));
  }, [chainId, idToChain]);
}

/**
 * same behavior as v4 `useChain()` but for v5
 */
export function useActiveChainAsDashboardChain(): ChainMetadata | undefined {
  // eslint-disable-next-line no-restricted-syntax
  const activeChainId = useActiveWalletChain()?.id;
  const { idToChain } = useAllChainsData();

  // memo is very very important!
  return useMemo(() => {
    return activeChainId ? idToChain.get(activeChainId) : undefined;
  }, [activeChainId, idToChain]);
}
