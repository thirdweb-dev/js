import { type UseQueryOptions, useQueries } from "@tanstack/react-query";
import { prepare as prepareOnramp } from "../../../../bridge/Onramp.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getToken } from "../../../../pay/convert/get-token.js";
import type { Address } from "../../../../utils/address.js";
import { toUnits } from "../../../../utils/units.js";

/**
 * @internal
 */
type UseBuyWithFiatQuotesForProvidersParams = {
  /**
   * A client is the entry point to the thirdweb SDK.
   */
  client: ThirdwebClient;
  /**
   * The destination chain ID.
   */
  chainId: number;
  /**
   * The destination token address.
   */
  tokenAddress: Address;
  /**
   * The address that will receive the tokens.
   */
  receiver: Address;
  /**
   * The desired token amount in wei.
   */
  amount: string;
  /**
   * The fiat currency (e.g., "USD"). Defaults to "USD".
   */
  currency?: string;
};

/**
 * @internal
 */
type OnrampQuoteQueryOptions = Omit<
  UseQueryOptions<Awaited<ReturnType<typeof prepareOnramp>>>,
  "queryFn" | "queryKey" | "enabled"
>;

/**
 * @internal
 */
type UseBuyWithFiatQuotesForProvidersResult = {
  data: Awaited<ReturnType<typeof prepareOnramp>> | undefined;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
}[];

/**
 * @internal
 * Hook to get prepared onramp quotes from Coinbase, Stripe, and Transak providers.
 */
export function useBuyWithFiatQuotesForProviders(
  params?: UseBuyWithFiatQuotesForProvidersParams,
  queryOptions?: OnrampQuoteQueryOptions,
): UseBuyWithFiatQuotesForProvidersResult {
  const providers = ["coinbase", "stripe", "transak"] as const;

  const queries = useQueries({
    queries: providers.map((provider) => ({
      ...queryOptions,
      enabled: !!params,
      queryFn: async () => {
        if (!params) {
          throw new Error("No params provided");
        }

        const token = await getToken(
          params.client,
          params.tokenAddress,
          params.chainId,
        );

        const amountWei = toUnits(params.amount, token.decimals);

        return prepareOnramp({
          amount: amountWei,
          chainId: params.chainId,
          client: params.client,
          currency: params.currency || "USD",
          onramp: provider,
          receiver: params.receiver,
          tokenAddress: params.tokenAddress,
        });
      },
      queryKey: ["onramp-prepare", provider, params],
      retry: false,
    })),
  });

  return queries;
}
