import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { Chain } from "@thirdweb-dev/chains";
import { fetchChain } from "@thirdweb-dev/chains";

/**
 * @internal
 */
export function useSwapSupportedChains(
  clientId: string,
): UseQueryResult<Chain[]> {
  return useQuery({
    queryKey: ["swapSupportedChains"],
    queryFn: async () => {
      const headers = new Headers();
      headers.set("x-client-id", clientId);
      const res = await fetch(`https://pay.thirdweb.com/chains`, {
        headers,
      });
      const data = await res.json();
      const chainIds = data.result.chainIds as number[];
      const chains = await Promise.all(chainIds.map(fetchChain));
      return chains.filter((chain) => chain !== null) as Chain[];
    },
  });
}
