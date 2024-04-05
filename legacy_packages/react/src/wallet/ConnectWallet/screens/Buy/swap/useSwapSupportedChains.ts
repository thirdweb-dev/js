import { useQuery, UseQueryResult } from "@tanstack/react-query";

/**
 * @internal
 */
export function useSwapSupportedChains(): UseQueryResult<number[]> {
  return useQuery({
    queryKey: ["swapSupportedChains"],
    queryFn: async () => {
      const res = await fetch(
        `https://pay.thirdweb.com/buy-with-crypto/quote/v1`,
      );
      const data = await res.json();
      const chainIds = data.result.chainIds as number[];
      return chainIds;
    },
  });
}
