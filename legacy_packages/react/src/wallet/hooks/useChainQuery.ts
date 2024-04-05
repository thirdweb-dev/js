import type { Chain } from "@thirdweb-dev/chains";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

type FetchChainResponse =
  | {
      data: Chain;
      error?: never;
    }
  | {
      data?: never;
      error: unknown;
    };

/**
 * @internal
 */
export function useChainQuery(chainId: number): UseQueryResult<Chain> {
  return useQuery({
    queryKey: ["chain", chainId],
    staleTime: 1000 * 60 * 60, // 1 hour
    queryFn: async () => {
      const res = await fetch(`https://api.thirdweb.com/v1/chains/${chainId}`);
      if (!res.ok) {
        res.body?.cancel();
        throw new Error(`Failed to fetch chain data for chainId ${chainId}`);
      }

      const response = (await res.json()) as FetchChainResponse;
      return response.data;
    },
  });
}
