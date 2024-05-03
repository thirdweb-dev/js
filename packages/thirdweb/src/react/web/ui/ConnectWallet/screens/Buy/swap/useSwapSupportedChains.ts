import { useQuery } from "@tanstack/react-query";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { getPayChainsEndpoint } from "../../../../../../../pay/utils/definitions.js";
import { getClientFetch } from "../../../../../../../utils/fetch.js";
import { withCache } from "../../../../../../../utils/promise/withCache.js";

export interface PaySupportedChainsResponse {
  result: {
    sourceChains: {
      name: string;
      chain: string;
      chainId: number;
    }[];
    destinationChains: {
      name: string;
      chain: string;
      chainId: number;
    }[]
  }
}

export async function fetchBuySupportedChains(client: ThirdwebClient) {
  return withCache(
    async () => {
      const fetchWithHeaders = getClientFetch(client);
      const res = await fetchWithHeaders(getPayChainsEndpoint());
      const data = await res.json() as PaySupportedChainsResponse;

      const sourceChains: number[] = data.result.sourceChains.map(chain => chain.chainId);
      const destinationChains: number[] = data.result.destinationChains.map(chain => chain.chainId);

      return {
        sourceChains: sourceChains.map(defineChain),
        destinationChains: destinationChains.map(defineChain);
      }
    },
    {
      cacheKey: "buy-supported-chains",
      cacheTime: 5 * 60 * 1000,
    },
  );
}

/**
 * @internal
 */
export function useBuySupportedChains(client: ThirdwebClient) {
  return useQuery({
    queryKey: ["buy-supported-chains", client],
    queryFn: async () => {
      return fetchBuySupportedChains(client);
    },
  });
}
