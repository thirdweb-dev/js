import { useQuery } from "@tanstack/react-query";
import { routes } from "../../../bridge/Routes.js";
import type { Token } from "../../../bridge/types/Token.js";
import { getCachedChain } from "../../../chains/utils.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { isInsightEnabled } from "../../../insight/common.js";
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
      const allRoutes = await routes({
        client,
        destinationChainId: destinationToken.chainId,
        destinationTokenAddress: destinationToken.address,
        includePrices: true,
        limit: 100,
        maxSteps: 3,
        sortBy: "popularity", // Get top 100 most popular routes
      });

      const allOriginTokens = includeDestinationToken
        ? [destinationToken, ...allRoutes.map((route) => route.originToken)]
        : allRoutes.map((route) => route.originToken);

      // 1. Resolve all unique chains in the supported token map
      const uniqueChains = Array.from(
        new Set(allOriginTokens.map((t) => t.chainId)),
      );

      // 2. Check insight availability once per chain
      const insightSupport = await Promise.all(
        uniqueChains.map(async (c) => ({
          chain: getCachedChain(c),
          enabled: await isInsightEnabled(getCachedChain(c)),
        })),
      );
      const insightEnabledChains = insightSupport.filter((c) => c.enabled);

      // 3. ERC-20 balances for insight-enabled chains (batched 5 chains / call)
      let owned: OwnedTokenWithQuote[] = [];
      let page = 0;
      const limit = 100;

      while (true) {
        const batch = await getOwnedTokens({
          chains: insightEnabledChains.map((c) => c.chain),
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

        // find matching origin token in allRoutes
        const tokensWithBalance = batch
          .map((b) => ({
            balance: b.value,
            originAmount: 0n,
            originToken: allOriginTokens.find(
              (t) =>
                t.address.toLowerCase() === b.tokenAddress.toLowerCase() &&
                t.chainId === b.chainId,
            ),
          }))
          .filter((t) => !!t.originToken) as OwnedTokenWithQuote[];

        owned = [...owned, ...tokensWithBalance];
        page += 1;
      }

      const requiredDollarAmount =
        Number.parseFloat(destinationAmount) * destinationToken.priceUsd;

      // sort by dollar balance descending
      owned.sort((a, b) => {
        const aDollarBalance =
          Number.parseFloat(toTokens(a.balance, a.originToken.decimals)) *
          a.originToken.priceUsd;
        const bDollarBalance =
          Number.parseFloat(toTokens(b.balance, b.originToken.decimals)) *
          b.originToken.priceUsd;
        return bDollarBalance - aDollarBalance;
      });

      const suitableOriginTokens: OwnedTokenWithQuote[] = [];

      for (const b of owned) {
        if (b.originToken && b.balance > 0n) {
          const dollarBalance =
            Number.parseFloat(toTokens(b.balance, b.originToken.decimals)) *
            b.originToken.priceUsd;
          if (b.originToken.priceUsd && dollarBalance < requiredDollarAmount) {
            continue;
          }

          if (
            includeDestinationToken &&
            b.originToken.address.toLowerCase() ===
              destinationToken.address.toLowerCase() &&
            b.originToken.chainId === destinationToken.chainId
          ) {
            // add same token to the front of the list
            suitableOriginTokens.unshift({
              balance: b.balance,
              originAmount: 0n,
              originToken: b.originToken,
            });
            continue;
          }

          suitableOriginTokens.push({
            balance: b.balance,
            originAmount: 0n,
            originToken: b.originToken,
          });
        }
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
