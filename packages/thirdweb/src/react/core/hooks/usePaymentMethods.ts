import { useQuery } from "@tanstack/react-query";
import { Value } from "ox";
import type { Quote } from "../../../bridge/index.js";
import type { Token } from "../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../utils/domains.js";
import { getClientFetch } from "../../../utils/fetch.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { PaymentMethod } from "../machines/paymentMachine.js";
import { useActiveWallet } from "./wallets/useActiveWallet.js";

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
  const localWallet = useActiveWallet();
  const wallet = payerWallet || localWallet;

  const routesQuery = useQuery({
    enabled: !!wallet,
    queryFn: async (): Promise<PaymentMethod[]> => {
      const account = wallet?.getAccount();
      if (!wallet || !account) {
        throw new Error("No wallet connected");
      }

      const clientFetch = getClientFetch(client);
      const url = new URL(
        `${getThirdwebBaseUrl("bridge")}/v1/buy/quote/${account.address}`,
      );
      url.searchParams.append(
        "destinationTokenAddress",
        destinationToken.address,
      );
      url.searchParams.append(
        "destinationChainId",
        destinationToken.chainId.toString(),
      );
      url.searchParams.append(
        "amount",
        Value.from(destinationAmount, destinationToken.decimals).toString(),
      );
      const response = await clientFetch(url.toString());

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const { data: quotes }: { data: _WalletQuotesResponse } =
        await response.json();

      const transformedRoutes = [
        ...quotes.map((s) => ({
          balance: BigInt(s.balance),
          quote: s.quote,
          originToken: s.token,
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

type _WalletQuotesResponse = Array<{
  quote: Quote;
  balance: string;
  token: Token;
}>;
