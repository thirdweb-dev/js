import { useMutation } from "@tanstack/react-query";
import type { GetBalanceResult } from "thirdweb/extensions/erc20";
import { THIRDWEB_API_HOST } from "@/constants/urls";

type WalletPortfolioToken = GetBalanceResult & {
  usdValue?: number;
  priceUsd?: number;
};

export type WalletPortfolioData = {
  totalUsdValue: number;
  tokens: WalletPortfolioToken[];
};

// Retry helper with exponential backoff - returns null on failure instead of throwing
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
): Promise<Response | null> {
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
    } catch (_e) {
      // Network error - retry with backoff
      const delay = Math.min(1000 * 2 ** attempt, 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // All retries failed - return null instead of throwing
  return null;
}

// Fetch tokens for a single address on a single chain
async function fetchTokensForChain(
  address: string,
  chainId: number,
  authToken: string,
  teamId: string,
  clientId?: string,
  ecosystemSlug?: string,
): Promise<WalletPortfolioToken[]> {
  try {
    const url = new URL(`${THIRDWEB_API_HOST}/v1/wallets/${address}/tokens`);
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
        "x-thirdweb-team-id": teamId,
        ...(clientId && { "x-client-id": clientId }),
        ...(ecosystemSlug && {
          "x-ecosystem-id": `ecosystem.${ecosystemSlug}`,
        }),
      },
    });

    // If all retries failed or response not ok, return empty (balance = 0)
    if (!response || !response.ok) {
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
  chainIds: number[],
  authToken: string,
  teamId: string,
  clientId?: string,
  ecosystemSlug?: string,
): Promise<WalletPortfolioData> {
  // Fetch all chains concurrently for this address
  const results = await Promise.all(
    chainIds.map((chainId) =>
      fetchTokensForChain(
        address,
        chainId,
        authToken,
        teamId,
        clientId,
        ecosystemSlug,
      ),
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
  chainIds: number[],
  authToken: string,
  teamId: string,
  clientId?: string,
  ecosystemSlug?: string,
  onProgress?: (completed: number, total: number) => void,
): Promise<Map<string, WalletPortfolioData>> {
  const results = new Map<string, WalletPortfolioData>();
  const concurrency = 50; // Process up to 50 addresses concurrently
  let completed = 0;
  let index = 0;

  // Worker function that processes one address at a time
  async function worker() {
    while (index < addresses.length) {
      const currentIndex = index++;
      const address = addresses[currentIndex];
      if (!address) continue;

      try {
        const data = await fetchWalletPortfolio(
          address,
          chainIds,
          authToken,
          teamId,
          clientId,
          ecosystemSlug,
        );
        results.set(address, data);
      } catch (e) {
        // Silent fail - continue with others
        console.warn(`Failed to fetch portfolio for ${address}:`, e);
      }

      completed++;
      onProgress?.(completed, addresses.length);
    }
  }

  // Start concurrent workers
  const workers = Array.from(
    { length: Math.min(concurrency, addresses.length) },
    () => worker(),
  );
  await Promise.all(workers);

  return results;
}

export function useFetchAllPortfolios() {
  return useMutation({
    mutationFn: async ({
      addresses,
      chainIds,
      authToken,
      teamId,
      clientId,
      ecosystemSlug,
      onProgress,
    }: {
      addresses: string[];
      chainIds: number[];
      authToken: string;
      teamId: string;
      clientId?: string;
      ecosystemSlug?: string;
      onProgress?: (completed: number, total: number) => void;
    }) => {
      return fetchAllPortfolios(
        addresses,
        chainIds,
        authToken,
        teamId,
        clientId,
        ecosystemSlug,
        onProgress,
      );
    },
  });
}
