import { useQuery } from "@tanstack/react-query";
import type { Quote } from "../../../bridge/index.js";
import { ApiError } from "../../../bridge/types/Errors.js";
import type { Token, TokenWithPrices } from "../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../utils/domains.js";
import { getClientFetch } from "../../../utils/fetch.js";
import { toTokens, toUnits } from "../../../utils/units.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { PaymentMethod } from "../../web/ui/Bridge/types.js";
import type { SupportedTokens } from "../utils/defaultTokens.js";
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
  supportedTokens?: SupportedTokens;
}) {
  const {
    destinationToken,
    destinationAmount,
    client,
    payerWallet,
    supportedTokens,
  } = options;
  const localWallet = useActiveWallet(); // TODO (bridge): get all connected wallets
  const wallet = payerWallet || localWallet;

  const query = useQuery({
    enabled: !!wallet,
    queryFn: async (): Promise<PaymentMethod[]> => {
      const account = wallet?.getAccount();
      if (!wallet || !account) {
        throw new Error("No wallet connected");
      }

      const url = new URL(
        `${getThirdwebBaseUrl("bridge")}/v1/buy/quote/${account.address}`,
      );
      url.searchParams.set(
        "destinationChainId",
        destinationToken.chainId.toString(),
      );
      url.searchParams.set("destinationTokenAddress", destinationToken.address);
      url.searchParams.set(
        "amount",
        toUnits(destinationAmount, destinationToken.decimals).toString(),
      );

      const clientFetch = getClientFetch(client);
      const response = await clientFetch(url.toString());
      if (!response.ok) {
        const errorJson = await response.json();
        throw new ApiError({
          code: errorJson.code || "UNKNOWN_ERROR",
          correlationId: errorJson.correlationId || undefined,
          message: errorJson.message || response.statusText,
          statusCode: response.status,
        });
      }

      const {
        data: allValidOriginTokens,
      }: { data: { quote: Quote; balance: string; token: TokenWithPrices }[] } =
        await response.json();

      // Sort by enough balance to pay THEN gross balance
      const validTokenQuotes = allValidOriginTokens.map((s) => ({
        balance: BigInt(s.balance),
        originToken: s.token,
        payerWallet: wallet,
        type: "wallet" as const,
        quote: s.quote,
      }));

      const sufficientBalanceQuotes = validTokenQuotes
        .filter((s) => !!s.originToken.prices.USD)
        .sort((a, b) => {
          return (
            Number.parseFloat(toTokens(b.balance, b.originToken.decimals)) *
              (b.originToken.prices.USD || 1) -
            Number.parseFloat(toTokens(a.balance, a.originToken.decimals)) *
              (a.originToken.prices.USD || 1)
          );
        });

      // Filter out quotes that are not included in the supportedTokens (if provided)
      const tokensToInclude = supportedTokens
        ? Object.keys(supportedTokens).flatMap(
            (c: string) =>
              supportedTokens[Number(c)]?.map((t) => ({
                chainId: Number(c),
                address: t.address,
              })) ?? [],
          )
        : [];
      const finalQuotes = supportedTokens
        ? sufficientBalanceQuotes.filter((q) =>
            tokensToInclude.find(
              (t) =>
                t.chainId === q.originToken.chainId &&
                t.address.toLowerCase() === q.originToken.address.toLowerCase(),
            ),
          )
        : sufficientBalanceQuotes;
      return finalQuotes.map((x) => ({
        ...x,
        action: "buy",
      }));
    },
    queryKey: [
      "payment-methods",
      destinationToken.chainId,
      destinationToken.address,
      destinationAmount,
      payerWallet?.getAccount()?.address,
      supportedTokens,
    ], // 5 minutes
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data || [],
    error: query.error,
    isError: query.isError,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}
