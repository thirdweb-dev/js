import { useQuery } from "@tanstack/react-query";
import { routes } from "../../../bridge/Routes.js";
import type { Token } from "../../../bridge/types/Token.js";
import { getCachedChain } from "../../../chains/utils.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import { isInsightEnabled } from "../../../insight/common.js";
import { getOwnedTokens } from "../../../insight/get-tokens.js";
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
  activeWallet?: Wallet;
}) {
  const { destinationToken, destinationAmount, client, activeWallet } = options;
  const localWallet = useActiveWallet(); // TODO (bridge): get all connected wallets
  const wallet = activeWallet || localWallet;

  const routesQuery = useQuery({
    queryKey: [
      "bridge-routes",
      destinationToken.chainId,
      destinationToken.address,
      destinationAmount,
      activeWallet?.getAccount()?.address,
    ],
    queryFn: async (): Promise<PaymentMethod[]> => {
      if (!wallet) {
        throw new Error("No wallet connected");
      }
      console.time("routes");
      const allRoutes = await routes({
        client,
        destinationChainId: destinationToken.chainId,
        destinationTokenAddress: destinationToken.address,
        sortBy: "popularity",
        includePrices: true,
        limit: 100, // Get top 100 most popular routes
      });
      console.log("allRoutes", allRoutes);

      // 1. Resolve all unique chains in the supported token map
      const uniqueChains = Array.from(
        new Set(allRoutes.map((route) => route.originToken.chainId)),
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
          ownerAddress: wallet.getAccount()?.address || "",
          chains: insightEnabledChains.map((c) => c.chain),
          client,
          queryOptions: {
            limit,
            page,
            metadata: "false",
          },
        }).catch((err) => {
          console.error("error fetching balances from insight", err);
          return [];
        });

        if (batch.length === 0) {
          break;
        }

        // find matching origin token in allRoutes
        const tokensWithBalance = batch
          .map((b) => ({
            originToken: allRoutes.find(
              (t) =>
                t.originToken.address.toLowerCase() ===
                  b.tokenAddress.toLowerCase() &&
                t.originToken.chainId === b.chainId,
            )?.originToken,
            balance: b.value,
            originAmount: 0n,
          }))
          .filter((t) => !!t.originToken) as OwnedTokenWithQuote[];

        owned = [...owned, ...tokensWithBalance];
        page += 1;
      }

      const requiredDollarAmount =
        Number.parseFloat(destinationAmount) * destinationToken.priceUsd;
      console.log("requiredDollarAmount", requiredDollarAmount);

      // TODO (bridge): sort owned by priceUsd if there's a way to get it from the routes endpoint
      //   owned.sort((a, b) => {
      //     const aDollarBalance =
      //       Number.parseFloat(a.balance.displayValue) * a.originToken.priceUsd;
      //     const bDollarBalance =
      //       Number.parseFloat(b.balance.displayValue) * b.originToken.priceUsd;
      //     return bDollarBalance - aDollarBalance;
      //   });

      const suitableOriginTokens: OwnedTokenWithQuote[] = [];

      for (const b of owned) {
        if (b.originToken && b.balance > 0n) {
          // TODO (bridge): add back in if we get priceUsd from the routes endpoint
          //   const dollarBalance =
          //     Number.parseFloat(toTokens(b.balance, b.originToken.decimals)) *
          //     b.originToken.priceUsd;
          //   if (b.originToken.priceUsd && dollarBalance < requiredDollarAmount) {
          //     console.log(
          //       "skipping",
          //       b.originToken.symbol,
          //       "because it's not enough",
          //     );
          //     continue;
          //   }

          suitableOriginTokens.push({
            balance: b.balance,
            originAmount: 0n,
            originToken: b.originToken,
          });
        }
      }

      console.log("suitableOriginTokens", suitableOriginTokens.length);
      console.timeEnd("routes");

      // sort by popular tokens - same chain first, then all native currencies, then USDC, then USDT, then other tokens
      const sortedSuitableOriginTokens = sortOwnedTokens(
        suitableOriginTokens,
        destinationToken,
      );

      const transformedRoutes = [
        ...sortedSuitableOriginTokens.map((s) => ({
          type: "wallet" as const,
          payerWallet: wallet,
          originToken: s.originToken,
          balance: s.balance,
        })),
      ];
      return transformedRoutes;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!wallet,
  });

  return {
    data: routesQuery.data || [],
    isLoading: routesQuery.isLoading,
    error: routesQuery.error,
    isError: routesQuery.isError,
    isSuccess: routesQuery.isSuccess,
    refetch: routesQuery.refetch,
  };
}

function sortOwnedTokens(
  owned: OwnedTokenWithQuote[],
  destinationToken: Token,
) {
  return [
    ...owned.filter((t) => t.originToken.chainId === destinationToken.chainId),
    ...owned.filter(
      (t) =>
        t.originToken.chainId !== destinationToken.chainId &&
        t.originToken.address.toLowerCase() ===
          NATIVE_TOKEN_ADDRESS.toLowerCase(),
    ),
    ...owned.filter(
      (t) =>
        t.originToken.chainId !== destinationToken.chainId &&
        t.originToken.symbol === "USDC",
    ),
    ...owned.filter(
      (t) =>
        t.originToken.chainId !== destinationToken.chainId &&
        t.originToken.symbol === "USDT",
    ),
    ...owned.filter(
      (t) =>
        t.originToken.chainId !== destinationToken.chainId &&
        t.originToken.address.toLowerCase() !==
          NATIVE_TOKEN_ADDRESS.toLowerCase() &&
        t.originToken.symbol !== "USDC" &&
        t.originToken.symbol !== "USDT",
    ),
  ];
}
