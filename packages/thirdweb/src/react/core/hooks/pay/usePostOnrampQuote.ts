import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import type { BuyWithCryptoQuote } from "../../../../pay/buyWithCrypto/getQuote.js";
import {
  type GetPostOnRampQuoteParams,
  getPostOnRampQuote,
} from "../../../../pay/buyWithFiat/getPostOnRampQuote.js";

/**
 * @internal
 */
export type PostOnRampQuoteQueryOptions = Omit<
  UseQueryOptions<BuyWithCryptoQuote>,
  "queryFn" | "queryKey" | "enabled"
>;

/**
 * When buying a token with fiat currency, It may be a 2 step process where the user is sent an intermediate token from the on-ramp provider ( known as "On-ramp" token )
 * and then it needs to be swapped to destination token.
 *
 * When you get a "Buy with Fiat" status of type "CRYPTO_SWAP_REQUIRED" from the [`useBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/useBuyWithFiatStatus) hook,
 * you can use `usePostOnRampQuote` hook to get the quote of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote) for swapping the on-ramp token to destination token to complete the step-2 of the process.
 *
 * Once you have the quote, you can start the Swap process by following the same steps as mentioned in the [`useBuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/useBuyWithCryptoQuote) documentation.
 *
 * @param params - object of type [`GetPostOnRampQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetPostOnRampQuoteParams)
 * @returns Object of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote) which contains the information about the quote such as processing fees, estimated time, converted token amounts, etc.
 * @buyFiat
 */
export function usePostOnRampQuote(
  params?: GetPostOnRampQuoteParams,
  queryOptions?: PostOnRampQuoteQueryOptions,
): UseQueryResult<BuyWithCryptoQuote> {
  return useQuery({
    ...queryOptions,
    queryKey: ["getPostOnRampQuote", params],
    queryFn: async () => {
      if (!params) {
        throw new Error("No params provided");
      }
      return getPostOnRampQuote(params);
    },
    enabled: !!params,
  });
}
