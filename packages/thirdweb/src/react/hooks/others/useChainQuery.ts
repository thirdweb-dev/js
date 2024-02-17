import { useQueries, useQuery, queryOptions } from "@tanstack/react-query";
import { getChainDataForChainId } from "../../../chains/utils.js";

/**
 * @internal
 */
function getChainQuery(chainId?: number) {
  // TODO make this aware of local overrides (developer passed into provider or something)
  return queryOptions({
    queryKey: ["chain", `${chainId}`] as const,
    queryFn: async () => {
      if (!chainId) {
        throw new Error("chainId is required");
      }
      return getChainDataForChainId(chainId);
    },
    enabled: !!chainId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * @internal
 */
export function useChainQuery(chainId?: number) {
  return useQuery(getChainQuery(chainId));
}

/**
 * @internal
 */
export function useChainsQuery(chainIds: number[]) {
  // this way the underlying queries end up shared with the single query!
  return useQueries({
    queries: chainIds.map(getChainQuery),
  });
}
