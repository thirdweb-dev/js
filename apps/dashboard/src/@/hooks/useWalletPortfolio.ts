import { useMutation } from "@tanstack/react-query";
import type { ThirdwebClient } from "thirdweb";
import type { GetBalanceResult } from "thirdweb/extensions/erc20";

type WalletPortfolioToken = GetBalanceResult & {
  usdValue?: number;
  priceUsd?: number;
};

export type WalletPortfolioData = {
  totalUsdValue: number;
  tokens: WalletPortfolioToken[];
};

// Retry helper with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Retry on rate limit (429) or server errors (5xx)
      if (response.status === 429 || response.status >= 500) {
        const delay = Math.min(1000 * 2 ** attempt, 10000); // Max 10s delay
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      // Network error - retry with backoff
      const delay = Math.min(1000 * 2 ** attempt, 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

// Fetch tokens for a single address on a single chain
async function fetchTokensForChain(
  address: string,
  chainId: number,
  client: ThirdwebClient,
  authToken: string,
): Promise<WalletPortfolioToken[]> {
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

    const response = await fetchWithRetry(url.toString(), {
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
    // Silent fail for individual chain - continue with others
    console.warn(
      `Failed to fetch tokens for ${address} on chain ${chainId}:`,
      e,
    );
    return [];
  }
}

// Fetch tokens for a single address on selected chains
async function fetchWalletPortfolio(
  address: string,
  client: ThirdwebClient,
  chainIds: number[],
  authToken: string,
): Promise<WalletPortfolioData> {
  // Fetch all chains concurrently for this address
  const results = await Promise.all(
    chainIds.map((chainId) =>
      fetchTokensForChain(address, chainId, client, authToken),
    ),
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
async function fetchAllPortfolios(
  addresses: string[],
  client: ThirdwebClient,
  chainIds: number[],
  authToken: string,
  onProgress?: (completed: number, total: number) => void,
): Promise<Map<string, WalletPortfolioData>> {
  const results = new Map<string, WalletPortfolioData>();
  const batchSize = 10; // Process 10 addresses at a time for better throughput
  let completed = 0;

  for (let i = 0; i < addresses.length; i += batchSize) {
    const batch = addresses.slice(i, i + batchSize);

    // Process batch concurrently with individual error handling
    const batchResults = await Promise.allSettled(
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

    // Only add successful results
    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.set(result.value.address, result.value.data);
      }
    }

    completed = Math.min(i + batchSize, addresses.length);
    onProgress?.(completed, addresses.length);

    // Small delay between batches to avoid overwhelming the API
    if (i + batchSize < addresses.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
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
