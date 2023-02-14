import { Chain, allChains } from "@thirdweb-dev/chains";

export function getAllChainRecords() {
  const slugToChain: Record<string, Chain> = {};
  const chainIdToChain: Record<number, Chain> = {};

  for (const chain of allChains) {
    slugToChain[chain.slug] = chain;
    chainIdToChain[chain.chainId] = chain;
  }

  return {
    slugToChain,
    chainIdToChain,
  };
}
