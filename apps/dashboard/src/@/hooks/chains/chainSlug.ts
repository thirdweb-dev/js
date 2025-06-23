import { useAllChainsData } from "./allChains";

/**
 *
 * @returns the slug for the given evm chainId
 */
export function useChainSlug(chainId: string | number | undefined) {
  const { idToChain } = useAllChainsData();

  if (!chainId) {
    return "";
  }

  const _chain = idToChain.get(
    typeof chainId === "string" ? Number.parseInt(chainId) : chainId,
  );

  if (_chain) {
    return _chain.slug;
  }

  // if can not find a network slug - use chainId as slug
  return chainId;
}
