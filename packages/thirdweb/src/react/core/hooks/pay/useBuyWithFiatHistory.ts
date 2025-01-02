import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import {
  type BuyWithFiatHistoryData,
  type BuyWithFiatHistoryParams,
  getBuyWithFiatHistory,
} from "../../../../pay/buyWithFiat/getHistory.js";

/**
 * @internal
 */
export type BuyWithFiatHistoryQueryOptions = Omit<
  UseQueryOptions<BuyWithFiatHistoryData>,
  "queryFn" | "queryKey" | "enabled"
>;

/**
 * Hook to get the "Buy with Fiat" transaction history for a given wallet address.
 *
 * This hook is a React Query wrapper of the [`getBuyWithFiatHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithFiatHistory) function.
 * You can also use that function directly
 * @param params - object of type [`BuyWithFiatHistoryParams`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatHistoryParams)
 * @param queryParams - options to configure the react query
 * @returns A React Query object which contains the data of type [`BuyWithFiatHistoryData`](https://portal.thirdweb.com/references/typescript/v5/BuyWithFiatHistoryData)
 * @example
 * ```tsx
 * import { useBuyWithFiatHistory } from "thirdweb/react";
 *
 * function Component() {
 *  const historyQuery = useBuyWithFiatHistory(params);
 *  return <div> ... </div>
 * }
 * ```
 * @buyCrypto
 */
export function useBuyWithFiatHistory(
  params?: BuyWithFiatHistoryParams,
  queryParams?: BuyWithFiatHistoryQueryOptions,
): UseQueryResult<BuyWithFiatHistoryData> {
  return useQuery({
    ...queryParams,
    queryKey: ["buyWithFiatHistory", params],
    queryFn: () => {
      if (!params) {
        throw new Error("params are required");
      }
      return getBuyWithFiatHistory(params);
    },
    enabled: !!params,
  });
}
