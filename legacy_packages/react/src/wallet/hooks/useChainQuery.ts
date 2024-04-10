import { fetchChain, type Chain } from "@thirdweb-dev/chains";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

/**
 * @internal
 */
export function useChainQuery(chainId?: number): UseQueryResult<Chain> {
  return useQuery({
    queryKey: ["chain", chainId],
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!chainId,
    queryFn: async () => {
      if (!chainId) {
        throw new Error("chainId is required");
      }
      const chain = await fetchChain(chainId);
      if (!chain) {
        throw new Error(`Chain with chainId "${chainId}" not found`);
      }
      return chain;
    },
  });
}
