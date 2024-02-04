import { useQueries, useQuery, queryOptions } from "@tanstack/react-query";
import { getChainDataForChainId } from "../../../chain/index.js";

/**
 * @internal
 */
function getChainQuery(chainId?: bigint) {
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
export function useChainQuery(chainId?: bigint) {
  return useQuery(getChainQuery(chainId));
}

/**
 * @internal
 */
export function useChainsQuery(chainIds: bigint[]) {
  // this way the underlying queries end up shared with the single query!
  return useQueries({
    queries: chainIds.map(getChainQuery),
  });
}
