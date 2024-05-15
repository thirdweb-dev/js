import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../../../../chains/types.js";
import { defineChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import {
  getPaySupportedDestinations,
  getPaySupportedSources,
} from "../../../../../../../pay/utils/definitions.js";
import { getClientFetch } from "../../../../../../../utils/fetch.js";
import { withCache } from "../../../../../../../utils/promise/withCache.js";

type Response = {
  result: Array<{
    chainId: number;
    tokens: Array<{
      address: string;
      buyWithCryptoEnabled: boolean;
      buyWithFiatEnabled: boolean;
      name: string;
      symbol: string;
    }>;
  }>;
};

export type SupportedChainAndTokens = Array<{
  chain: Chain;
  tokens: Array<{
    address: string;
    buyWithCryptoEnabled: boolean;
    buyWithFiatEnabled: boolean;
    name: string;
    symbol: string;
    icon?: string;
  }>;
}>;

export async function fetchBuySupportedDestinations(
  client: ThirdwebClient,
): Promise<SupportedChainAndTokens> {
  return withCache(
    async () => {
      const fetchWithHeaders = getClientFetch(client);
      const res = await fetchWithHeaders(getPaySupportedDestinations());
      const data = (await res.json()) as Response;
      return data.result.map((item) => ({
        chain: defineChain({
          id: item.chainId,
        }),
        tokens: item.tokens,
      }));
    },
    {
      cacheKey: "destination-tokens",
      cacheTime: 5 * 60 * 1000,
    },
  );
}

/**
 * @internal
 */
export function useBuySupportedDestinations(client: ThirdwebClient) {
  return useQuery({
    queryKey: ["destination-tokens", client],
    queryFn: async () => {
      return fetchBuySupportedDestinations(client);
    },
  });
}

export function useBuySupportedSources(options: {
  client: ThirdwebClient;
  destinationChainId: number;
  destinationTokenAddress: string;
}) {
  return useQuery({
    queryKey: ["source-tokens", options],
    queryFn: async () => {
      const fetchWithHeaders = getClientFetch(options.client);
      const baseUrl = getPaySupportedSources();

      const url = new URL(baseUrl);
      url.searchParams.append(
        "destinationChainId",
        options.destinationChainId.toString(),
      );
      url.searchParams.append(
        "destinationTokenAddress",
        options.destinationTokenAddress,
      );

      const res = await fetchWithHeaders(url.toString());
      const data = (await res.json()) as Response;
      return data.result.map((item) => ({
        chain: defineChain({
          id: item.chainId,
        }),
        tokens: item.tokens,
      }));
    },
  });
}
