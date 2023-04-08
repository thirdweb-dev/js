import { useSupportedChainsRecord } from "./configureChains";
import {
  DashboardSolanaNetwork,
  SupportedSolanaNetworkToUrlMap,
} from "utils/solanaUtils";

/**
 *
 * @returns the slug for the given evm or solana chainId
 */
export function useChainSlug(chainId: string | number) {
  const configuredChainsRecord = useSupportedChainsRecord();

  // Solana
  if (chainId in SupportedSolanaNetworkToUrlMap) {
    return SupportedSolanaNetworkToUrlMap[chainId as DashboardSolanaNetwork];
  }

  // EVM
  else if (chainId in configuredChainsRecord) {
    return configuredChainsRecord[chainId as number].slug;
  }

  // if can not find a network slug - use chainId as slug
  return chainId;
}
