import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  type BuyWithFiatStatus,
  type GetBuyWithFiatStatusParams,
  getBuyWithFiatStatus,
} from "../../../../pay/buyWithFiat/getStatus.js";

/**
 * A hook to get a status of a "Buy with Fiat" transaction to determine if the transaction is completed, failed or pending.
 *
 * This hook is a React Query wrapper of the [`getBuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoStatus) function.
 * You can also use that function directly.
 *
 * `useBuyWithFiatStatus` refetches the status using `getBuyWithFiatStatus` every 5 seconds.
 *
 * @param params - object of type [`GetBuyWithFiatStatusParams`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoTransaction)
 * @returns A react query object which contains the data of type [`BuyWithFiatStatus`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoStatus)
 * @example
 * ```tsx
 * import { useBuyWithFiatStatus } from "thirdweb/react";
 * import { client } from "./client";
 *
 * function Example() {
 *   const fiatStatus = useBuyWithFiatStatus({
 *     client: client, // thirdweb client
 *     intentId: "....", // get the intentId from quote ( quote.intentId )
 *   });
 *
 *   console.log(fiatStatus.data);
 *
 *   return <div>...</div>;
 * }
 * ```
 * @buyCrypto
 */
export function useBuyWithFiatStatus(
  params?: GetBuyWithFiatStatusParams,
): UseQueryResult<BuyWithFiatStatus> {
  return useQuery({
    queryKey: ["useBuyWithFiatStatus", params],
    queryFn: async () => {
      if (!params) {
        throw new Error("No params provided");
      }
      return getBuyWithFiatStatus(params);
    },
    enabled: !!params,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    retry: true,
  });
}
