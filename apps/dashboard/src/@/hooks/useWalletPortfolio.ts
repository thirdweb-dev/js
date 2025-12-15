import { useMutation } from "@tanstack/react-query";
import type { ThirdwebClient } from "thirdweb";
import type { GetBalanceResult } from "thirdweb/extensions/erc20";

export type WalletPortfolioToken = GetBalanceResult & {
  usdValue?: number;
  priceUsd?: number;
};

export type WalletPortfolioData = {
  totalUsdValue: number;
  tokens: WalletPortfolioToken[];
};

// Fetch tokens for a single address on selected chains
async function fetchWalletPortfolio(
  address: string,
  client: ThirdwebClient,
  chainIds: number[],
  authToken: string,
): Promise<WalletPortfolioData> {
  const results = await Promise.all(
    chainIds.map(async (chainId) => {
      try {
        const url = new URL(
          `https://api.thirdweb.com/v1/wallets/${address}/tokens`,
        );
        url.searchParams.set("chainId", chainId.toString());
        url.searchParams.set("limit", "50");
        url.searchParams.set("metadata", "true");
        url.searchParams.set("includeSpam", "false");
        url.searchParams.set("includeNative", "true");
        url.searchParams.set("sortBy", "usd_value");
        url.searchParams.set("sortOrder", "desc");

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "x-client-id": client.clientId,
          },
        });

        if (!response.ok) {
          return [];
        }

        const data = await response.json();
        const rawTokens = data.result?.tokens || [];

        return rawTokens.map(
          (t: {
            balance: string;
            decimals: number;
            name: string;
            symbol: string;
            token_address: string;
            chain_id: number;
            price_data?: { usd_value?: number; price_usd?: number };
          }): WalletPortfolioToken => ({
            value: BigInt(t.balance),
            decimals: t.decimals,
            displayValue: (Number(t.balance) / 10 ** t.decimals).toString(),
            name: t.name,
            symbol: t.symbol,
            tokenAddress: t.token_address,
            chainId: t.chain_id,
            usdValue: t.price_data?.usd_value,
            priceUsd: t.price_data?.price_usd,
          }),
        );
      } catch (e) {
        console.error(
          `Failed to fetch tokens for ${address} on chain ${chainId}:`,
          e,
        );
        return [];
      }
    }),
  );

  const allTokens = results.flat();
  const totalUsdValue = allTokens.reduce(
    (acc, token) => acc + (token.usdValue || 0),
    0,
  );

  return {
    totalUsdValue,
    tokens: allTokens,
  };
}

// Batch fetch portfolios for all addresses with progress callback
export async function fetchAllPortfolios(
  addresses: string[],
  client: ThirdwebClient,
  chainIds: number[],
  authToken: string,
  onProgress?: (completed: number, total: number) => void,
): Promise<Map<string, WalletPortfolioData>> {
  const results = new Map<string, WalletPortfolioData>();
  const batchSize = 5; // Process 5 addresses at a time to avoid rate limits

  for (let i = 0; i < addresses.length; i += batchSize) {
    const batch = addresses.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (address) => {
        const data = await fetchWalletPortfolio(
          address,
          client,
          chainIds,
          authToken,
        );
        return { address, data };
      }),
    );

    for (const { address, data } of batchResults) {
      results.set(address, data);
    }

    onProgress?.(Math.min(i + batchSize, addresses.length), addresses.length);
  }

  return results;
}

export function useFetchAllPortfolios() {
  return useMutation({
    mutationFn: async ({
      addresses,
      client,
      chainIds,
      authToken,
      onProgress,
    }: {
      addresses: string[];
      client: ThirdwebClient;
      chainIds: number[];
      authToken: string;
      onProgress?: (completed: number, total: number) => void;
    }) => {
      return fetchAllPortfolios(
        addresses,
        client,
        chainIds,
        authToken,
        onProgress,
      );
    },
  });
}
