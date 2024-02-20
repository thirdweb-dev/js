import { useQueries, useQuery, queryOptions } from "@tanstack/react-query";
import { getChainDataForChain } from "../../../chains/utils.js";
import type { Chain } from "../../../index.js";

/**
 * @internal
 */
function getChainQuery(chain?: Chain) {
  const result = queryOptions({
    queryKey: ["chain", chain] as const,
    queryFn: async () => {
      if (!chain) {
        throw new Error("chainId is required");
      }
      return getChainDataForChain(chain);
    },
    enabled: !!chain,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return result;
}

/**
 * @internal
 */
export function useChainQuery(chain?: Chain) {
  return useQuery(getChainQuery(chain));
}

/**
 * @internal
 */
export function useChainsQuery(chains: Chain[]) {
  // this way the underlying queries end up shared with the single query!
  return useQueries({
    queries: chains.map(getChainQuery),
  });
}
