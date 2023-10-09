import { useSupportedChainsRecord } from "./configureChains";

/**
 *
 * @returns the slug for the given evm chainId
 */
export function useChainSlug(chainId: string | number) {
  const configuredChainsRecord = useSupportedChainsRecord();

  // EVM
  if (chainId in configuredChainsRecord) {
    return configuredChainsRecord[chainId as number].slug;
  }

  // if can not find a network slug - use chainId as slug
  return chainId;
}
