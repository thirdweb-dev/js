import { useQuery } from "@tanstack/react-query";
import type { Token } from "../../../../../bridge/index.js";
import { tokens } from "../../../../../bridge/Token.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { isAddress } from "../../../../../utils/address.js";
import { getThirdwebBaseUrl } from "../../../../../utils/domains.js";

export function useTokens(options: {
  client: ThirdwebClient;
  chainId?: number;
  search?: string;
  offset: number;
  limit: number;
}) {
  return useQuery<Token[]>({
    queryKey: ["tokens", options],
    enabled: !!options.chainId,
    retry: false,
    queryFn: () => {
      if (!options.chainId) {
        throw new Error("Chain ID is required");
      }

      const isSearchAddress = options.search
        ? isAddress(options.search)
        : false;

      return tokens({
        chainId: options.chainId,
        client: options.client,
        offset: options.offset,
        limit: options.limit,
        includePrices: false,
        query: options.search && !isSearchAddress ? options.search : undefined,
        tokenAddress:
          options.search && isSearchAddress ? options.search : undefined,
      });
    },
  });
}

export type TokenBalance = {
  balance: string;
  chain_id: number;
  decimals: number;
  name: string;
  icon_uri: string;
  price_data: {
    circulating_supply: number;
    market_cap_usd: number;
    percent_change_24h: number;
    price_timestamp: string;
    price_usd: number;
    total_supply: number;
    usd_value: number;
    volume_24h_usd: number;
  };
  symbol: string;
  token_address: string;
};

type TokenBalancesResponse = {
  result: {
    pagination: {
      hasMore: boolean;
      limit: number;
      page: number;
      totalCount: number;
    };
    tokens: TokenBalance[];
  };
};

export function useTokenBalances(options: {
  clientId: string;
  page: number;
  limit: number;
  walletAddress: string | undefined;
  chainId: number | undefined;
}) {
  return useQuery({
    queryKey: ["bridge/v1/wallets", options],
    enabled: !!options.chainId && !!options.walletAddress,
    queryFn: async () => {
      if (!options.chainId || !options.walletAddress) {
        throw new Error("invalid options");
      }
      const baseUrl = getThirdwebBaseUrl("bridge");
      const isDev = baseUrl.includes("thirdweb-dev");
      const url = new URL(
        `https://api.${isDev ? "thirdweb-dev" : "thirdweb"}.com/v1/wallets/${options.walletAddress}/tokens`,
      );
      url.searchParams.set("chainId", options.chainId.toString());
      url.searchParams.set("limit", options.limit.toString());
      url.searchParams.set("page", options.page.toString());
      url.searchParams.set("metadata", "true");
      url.searchParams.set("resolveMetadataLinks", "true");
      url.searchParams.set("includeSpam", "false");
      url.searchParams.set("includeNative", "true");
      url.searchParams.set("sortBy", "usd_value");
      url.searchParams.set("sortOrder", "desc");
      url.searchParams.set("includeWithoutPrice", "false"); // filter out tokens with no price

      const response = await fetch(url.toString(), {
        headers: {
          "x-client-id": options.clientId,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch token balances: ${response.statusText}`,
        );
      }

      const json = (await response.json()) as TokenBalancesResponse;
      return json.result;
    },
    refetchOnMount: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
