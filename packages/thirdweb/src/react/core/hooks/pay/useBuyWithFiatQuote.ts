import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import {
  type BuyWithFiatQuote,
  type GetBuyWithFiatQuoteParams,
  getBuyWithFiatQuote,
} from "../../../../pay/buyWithFiat/getQuote.js";

export type BuyWithFiatQuoteQueryOptions = Omit<
  UseQueryOptions<BuyWithFiatQuote>,
  "queryFn" | "queryKey" | "enabled"
>;

/**
 * Hook to get a price quote for performing a "Buy with Fiat" transaction that allows users to buy a token with fiat currency.
 *
 * The price quote is an object of type [`BuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatQuote).
 * This quote contains the information about the purchase such as token amounts, processing fees, estimated time etc.
 *
 * This hook is a React Query wrapper of the [`getBuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatQuote) function.
 * You can also use that function directly
 *
 * Once you have the quote, you can open a new window with `onRampLink` as window location to allow the user to buy the token with fiat currency.
 * and [`useBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/useBuyWithFiatStatus) function to start polling for the status of this transaction.
 *
 * @param params - object of type [`GetBuyWithFiatQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetBuyWithFiatQuoteParams)
 * @param queryParams - options to configure the react query
 * @returns A React Query object which contains the data of type [`BuyWithFiatQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatQuote)
 * @buyFiat
 */
export function useBuyWithFiatQuote(
  params?: GetBuyWithFiatQuoteParams,
  queryOptions?: BuyWithFiatQuoteQueryOptions,
): UseQueryResult<BuyWithFiatQuote> {
  return useQuery({
    ...queryOptions,
    queryKey: ["useBuyWithFiatQuote", params],
    queryFn: async () => {
      if (!params) {
        throw new Error("No params provided");
      }
      return getBuyWithFiatQuote(params);
    },
    enabled: !!params,
    retry(failureCount, error) {
      if (failureCount > 3) {
        return false;
      }
      try {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        if ((error as any).error.code === "MINIMUM_PURCHASE_AMOUNT") {
          return false;
        }
      } catch {
        return true;
      }

      return true;
    },
  });
}
