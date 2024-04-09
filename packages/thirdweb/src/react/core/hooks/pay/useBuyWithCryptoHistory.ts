import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import {
  type BuyWithCryptoHistoryData,
  type BuyWithCryptoHistoryParams,
  getBuyWithCryptoHistory,
} from "../../../../pay/buyWithCrypto/actions/getHistory.js";

export type BuyWithCryptoHistoryQueryParams = BuyWithCryptoHistoryParams;
export type BuyWithCryptoQuoteQueryOptions = Omit<
  UseQueryOptions<BuyWithCryptoHistoryData>,
  "queryFn" | "queryKey" | "enabled"
>;

/**
 * Hook to get the history of purchases a given wallet has performed.
 *
 * This hook is a React Query wrapper of the [`getBuyWithCryptoHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoHistory) function.
 * You can also use that function directly
 * @param buyWithCryptoHistoryParams - object of type [`BuyWithCryptoHistoryParams`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoHistoryParams)
 * @param queryParams - options to configure the react query
 * @returns A React Query object which contains the data of type [`BuyWithCryptoHistoryData`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoHistoryData)
 * @example
 * ```tsx
 * import { useBuyWithCryptoHistory } from "thirdweb/react";
 *
 * function Component() {
 *  const buyWithCryptoHistory = useBuyWithCryptoHistory(params);
 *  return <pre>{JSON.stringify(buyWithCryptoHistory.data, null, 2)}</pre>
 * }
 * ```
 * @buyCrypto
 */
export function useBuyWithCryptoHistory(
  buyWithCryptoHistoryParams?: BuyWithCryptoHistoryQueryParams,
  queryParams?: BuyWithCryptoQuoteQueryOptions,
): UseQueryResult<BuyWithCryptoHistoryData> {
  return useQuery({
    ...queryParams,

    queryKey: ["buyWithCryptoHistory", buyWithCryptoHistoryParams],
    queryFn: () => {
      if (!buyWithCryptoHistoryParams) {
        throw new Error("Swap params are required");
      }
      if (!buyWithCryptoHistoryParams?.client) {
        throw new Error("Client is required");
      }
      return getBuyWithCryptoHistory({
        ...buyWithCryptoHistoryParams,
        client: buyWithCryptoHistoryParams.client,
      });
    },
    enabled: !!buyWithCryptoHistoryParams,
  });
}
