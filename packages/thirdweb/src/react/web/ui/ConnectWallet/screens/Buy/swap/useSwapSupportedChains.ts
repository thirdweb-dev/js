import { useQuery } from "@tanstack/react-query";
import { Address as ox__Address } from "ox";
import * as Bridge from "../../../../../../../bridge/index.js";
import type { Chain } from "../../../../../../../chains/types.js";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { Address } from "../../../../../../../utils/address.js";
import { withCache } from "../../../../../../../utils/promise/withCache.js";

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

async function fetchBuySupportedDestinations({
  client,
  originChainId,
  originTokenAddress,
}: {
  client: ThirdwebClient;
  originChainId?: number;
  originTokenAddress?: Address;
}): Promise<SupportedChainAndTokens> {
  return withCache(
    async () => {
      const routes = await Bridge.routes({
        client,
        originChainId,
        originTokenAddress,
        maxSteps: 1,
        sortBy: "popularity",
        limit: 1_000_000,
      });
      const tokens = new Set<string>();
      const chains = new Set<number>();
      const destinationTokens: Record<
        number,
        Array<{
          address: Address;
          buyWithCryptoEnabled: boolean;
          buyWithFiatEnabled: boolean;
          name: string;
          symbol: string;
          icon?: string;
        }>
      > = [];
      for (const route of routes) {
        const key = `${route.destinationToken.chainId}:${route.destinationToken.address}`;
        if (!tokens.has(key)) {
          tokens.add(key);
          if (!chains.has(route.destinationToken.chainId)) {
            chains.add(route.destinationToken.chainId);
          }
          const existing = destinationTokens[route.destinationToken.chainId];
          if (!existing) {
            destinationTokens[route.destinationToken.chainId] = [];
          }
          destinationTokens[route.destinationToken.chainId] = [
            ...(existing || []),
            {
              address: ox__Address.checksum(
                route.destinationToken.address,
              ) as Address,
              // We support both options for all tokens
              buyWithCryptoEnabled: true,
              buyWithFiatEnabled: true,
              name: route.destinationToken.name,
              symbol: route.destinationToken.symbol,
              icon: route.destinationToken.iconUri,
            },
          ];
        }
      }

      return [...chains].map((chainId) => ({
        chain: getCachedChain(chainId),
        tokens: destinationTokens[chainId] || [],
      }));
    },
    {
      cacheKey: `buy-supported-destinations-${originChainId}:${originTokenAddress}`,
      cacheTime: 5 * 60 * 1000,
    },
  );
}

/**
 * @internal
 */
export function useBuySupportedDestinations(
  client: ThirdwebClient,
  _isTestMode?: boolean,
) {
  return useQuery({
    queryKey: ["destination-tokens", client],
    queryFn: async () => {
      return fetchBuySupportedDestinations({ client });
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
      const routes = await Bridge.routes({
        client: options.client,
        destinationChainId: options.destinationChainId,
        destinationTokenAddress: options.destinationTokenAddress,
        maxSteps: 1,
        sortBy: "popularity",
        limit: 50,
      });

      const tokens = new Set<string>();
      const chains = new Set<number>();
      const originTokens: Record<
        number,
        Array<{
          address: Address;
          buyWithCryptoEnabled: boolean;
          buyWithFiatEnabled: boolean;
          name: string;
          symbol: string;
          icon?: string;
        }>
      > = [];
      for (const route of routes) {
        const key = `${route.originToken.chainId}:${route.originToken.address}`;
        if (!tokens.has(key)) {
          tokens.add(key);
          if (!chains.has(route.originToken.chainId)) {
            chains.add(route.originToken.chainId);
          }
          const existing = originTokens[route.originToken.chainId];
          if (!existing) {
            originTokens[route.originToken.chainId] = [];
          }
          originTokens[route.originToken.chainId] = [
            ...(existing || []),
            {
              address: ox__Address.checksum(
                route.originToken.address,
              ) as Address,
              // We support both options for all tokens
              buyWithCryptoEnabled: true,
              buyWithFiatEnabled: true,
              name: route.originToken.name,
              symbol: route.originToken.symbol,
              icon: route.originToken.iconUri,
            },
          ];
        }
      }

      return [...chains].map((chainId) => ({
        chain: getCachedChain(chainId),
        tokens: originTokens[chainId] || [],
      }));
    },
  });
}
