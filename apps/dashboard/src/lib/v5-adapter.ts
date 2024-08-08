import { defineDashboardChain } from "lib/defineDashboardChain";
import { useMemo } from "react";
import type { Chain, ChainMetadata } from "thirdweb/chains";
import { useActiveWalletChain } from "thirdweb/react";
import { useSupportedChainsRecord } from "../hooks/chains/configureChains";

export function useV5DashboardChain(chainId: undefined): undefined;
export function useV5DashboardChain(chainId: number): Chain;
export function useV5DashboardChain(
  chainId: number | undefined,
): Chain | undefined;
export function useV5DashboardChain(
  chainId: number | undefined,
): Chain | undefined {
  const configuredChainsRecord = useSupportedChainsRecord();

  // memo is very very important!
  return useMemo(() => {
    let configuedChain = undefined;

    if (chainId === undefined) {
      return undefined;
    }

    if (chainId in configuredChainsRecord) {
      configuedChain = configuredChainsRecord[chainId as number];
    }

    // eslint-disable-next-line no-restricted-syntax
    return defineDashboardChain(chainId, configuedChain);
  }, [chainId, configuredChainsRecord]);
}

/**
 * same behavior as v4 `useChain()` but for v5
 */
export function useActiveChainAsDashboardChain(): ChainMetadata | undefined {
  // eslint-disable-next-line no-restricted-syntax
  const activeChain = useActiveWalletChain()?.id;
  const configuredChainsRecord = useSupportedChainsRecord();

  // memo is very very important!
  return useMemo(() => {
    if (activeChain && activeChain in configuredChainsRecord) {
      return configuredChainsRecord[activeChain as number];
    }
    return undefined;
  }, [activeChain, configuredChainsRecord]);
}
