import { useQuery } from "@tanstack/react-query";
import { chains } from "../../../bridge/Chains.js";
import { routes } from "../../../bridge/Routes.js";
import type { Token } from "../../../bridge/types/Token.js";
import {
  getCachedChain,
  getInsightEnabledChainIds,
} from "../../../chains/utils.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getOwnedTokens } from "../../../insight/get-tokens.js";
import { toTokens } from "../../../utils/units.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { PaymentMethod } from "../machines/paymentMachine.js";
import { useActiveWallet } from "./wallets/useActiveWallet.js";

type OwnedTokenWithQuote = {
  originToken: Token;
  balance: bigint;
  originAmount: bigint;
};

/**
 * Hook that returns available payment methods for BridgeEmbed
 * Fetches real routes data based on the destination token
 *
 * @param options - Configuration options
 * @param options.destinationToken - The destination token to find routes for
 * @param options.client - ThirdwebClient for API calls
 * @returns Available payment methods with route data
 *
 * @example
 * ```tsx
 * const { data: paymentMethods, isLoading, error } = usePaymentMethods({
 *   destinationToken,
 *   client
 * });
 * ```
 */
export function usePaymentMethods(options: {
  destinationToken: Token;
  destinationAmount: string;
  client: ThirdwebClient;
  payerWallet?: Wallet;
  includeDestinationToken?: boolean;
}) {
  const {
    destinationToken,
    destinationAmount,
    client,
    payerWallet,
    includeDestinationToken,
  } = options;
  const localWallet = useActiveWallet(); // TODO (bridge): get all connected wallets
  const wallet = payerWallet || localWallet;

  const routesQuery = useQuery({
    enabled: !!wallet,
    queryFn: async (): Promise<PaymentMethod[]> => {
      if (!wallet) {
        throw new Error("No wallet connected");
      }

      // 1. Get all supported chains
      const [allChains, insightEnabledChainIds] = await Promise.all([
        chains({ client }),
        getInsightEnabledChainIds(),
      ]);

      // 2. Check insight availability for all chains
      const insightEnabledChains = allChains.filter((c) =>
        insightEnabledChainIds.includes(c.chainId),
      );

      // 3. Get all owned tokens for insight-enabled chains
      let allOwnedTokens: Array<{
        balance: bigint;
        originToken: Token;
      }> = [];
      let page = 0;
      const limit = 500;

      while (true) {
        const batch = await getOwnedTokens({
          chains: insightEnabledChains.map((c) => getCachedChain(c.chainId)),
          client,
          ownerAddress: wallet.getAccount()?.address || "",
          queryOptions: {
            limit,
            metadata: "false",
            page,
          },
        });

        if (batch.length === 0) {
          break;
        }

        // Convert to our format and filter out zero balances
        const tokensWithBalance = batch
          .filter((b) => b.value > 0n)
          .map((b) => ({
            balance: b.value,
            originToken: {
              address: b.tokenAddress,
              chainId: b.chainId,
              decimals: b.decimals,
              iconUri: "",
              name: b.name,
              prices: {
                USD: 0,
              },
              symbol: b.symbol,
            } as Token,
          }));

        allOwnedTokens = [...allOwnedTokens, ...tokensWithBalance];
        page += 1;
      }

      // 4. For each chain where we have owned tokens, fetch possible routes
      const chainsWithOwnedTokens = Array.from(
        new Set(allOwnedTokens.map((t) => t.originToken.chainId)),
      );

      const allValidOriginTokens = new Map<string, Token>();

      // Add destination token if included
      if (includeDestinationToken) {
        const tokenKey = `${destinationToken.chainId}-${destinationToken.address.toLowerCase()}`;
        allValidOriginTokens.set(tokenKey, destinationToken);
      }

      // Fetch routes for each chain with owned tokens
      await Promise.all(
        chainsWithOwnedTokens.map(async (chainId) => {
          try {
            // TODO (bridge): this is quite inefficient, need to fix the popularity sorting to really capture all users tokens
            const routesForChain = await routes({
              client,
              destinationChainId: destinationToken.chainId,
              destinationTokenAddress: destinationToken.address,
              includePrices: true,
              limit: 100,
              maxSteps: 3,
              originChainId: chainId,
            });

            // Add all origin tokens from this chain's routes
            for (const route of routesForChain) {
              // Skip if the origin token is the same as the destination token, will be added later only if includeDestinationToken is true
              if (
                route.originToken.chainId === destinationToken.chainId &&
                route.originToken.address.toLowerCase() ===
                  destinationToken.address.toLowerCase()
              ) {
                continue;
              }
              const tokenKey = `${route.originToken.chainId}-${route.originToken.address.toLowerCase()}`;
              allValidOriginTokens.set(tokenKey, route.originToken);
            }
          } catch (error) {
            // Log error but don't fail the entire operation
            console.warn(`Failed to fetch routes for chain ${chainId}:`, error);
          }
        }),
      );

      // 5. Filter owned tokens to only include valid origin tokens
      const validOwnedTokens: OwnedTokenWithQuote[] = [];

      for (const ownedToken of allOwnedTokens) {
        const tokenKey = `${ownedToken.originToken.chainId}-${ownedToken.originToken.address.toLowerCase()}`;
        const validOriginToken = allValidOriginTokens.get(tokenKey);

        if (validOriginToken) {
          validOwnedTokens.push({
            balance: ownedToken.balance,
            originAmount: 0n,
            originToken: validOriginToken, // Use the token with pricing info from routes
          });
        }
      }

      // Sort by dollar balance descending
      validOwnedTokens.sort((a, b) => {
        const aDollarBalance =
          Number.parseFloat(toTokens(a.balance, a.originToken.decimals)) *
          (a.originToken.prices["USD"] || 0);
        const bDollarBalance =
          Number.parseFloat(toTokens(b.balance, b.originToken.decimals)) *
          (b.originToken.prices["USD"] || 0);
        return bDollarBalance - aDollarBalance;
      });

      const suitableOriginTokens: OwnedTokenWithQuote[] = [];

      for (const token of validOwnedTokens) {
        if (
          includeDestinationToken &&
          token.originToken.address.toLowerCase() ===
            destinationToken.address.toLowerCase() &&
          token.originToken.chainId === destinationToken.chainId
        ) {
          // Add same token to the front of the list
          suitableOriginTokens.unshift(token);
          continue;
        }

        suitableOriginTokens.push(token);
      }

      const transformedRoutes = [
        ...suitableOriginTokens.map((s) => ({
          balance: s.balance,
          originToken: s.originToken,
          payerWallet: wallet,
          type: "wallet" as const,
        })),
      ];
      return transformedRoutes;
    },
    queryKey: [
      "bridge-routes",
      destinationToken.chainId,
      destinationToken.address,
      destinationAmount,
      payerWallet?.getAccount()?.address,
      includeDestinationToken,
    ], // 5 minutes
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: routesQuery.data || [],
    error: routesQuery.error,
    isError: routesQuery.isError,
    isLoading: routesQuery.isLoading,
    isSuccess: routesQuery.isSuccess,
    refetch: routesQuery.refetch,
  };
}
