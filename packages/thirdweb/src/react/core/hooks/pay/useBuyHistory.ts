import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import {
  type BuyHistoryData,
  type BuyHistoryParams,
  getBuyHistory,
} from "../../../../pay/getBuyHistory.js";

/**
 * @internal
 */
export type BuyHistoryQueryOptions = Omit<
  UseQueryOptions<BuyHistoryData>,
  "queryFn" | "queryKey" | "enabled"
>;

/**
 * Hook to get the history of Buy transactions for a given wallet - This includes both "buy with crypto" and "buy with fiat" transactions.
 *
 * This hook is a React Query wrapper of the [`getBuyHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyHistory) function.
 * You can also use that function directly
 *
 * @param params - object of type [`BuyHistoryParams`](https://portal.thirdweb.com/references/typescript/v5/BuyHistoryParams)
 * @param queryParams - options to configure the react query
 * @returns A React Query object which contains the data of type [`BuyHistoryData`](https://portal.thirdweb.com/references/typescript/v5/BuyHistoryData)
 * @example
 * ```tsx
 * import { useBuyHistory } from "thirdweb/react";
 *
 * function Component() {
 *  const buyHistoryQuery = useBuyHistory(params);
 *  return <div> ... </div>
 * }
 * ```
 * @buyCrypto
 */
export function useBuyHistory(
  params?: BuyHistoryParams,
  queryParams?: BuyHistoryQueryOptions,
): UseQueryResult<BuyHistoryData> {
  return useQuery({
    ...queryParams,
    queryKey: ["getBuyHistory", params],
    queryFn: () => {
      if (!params) {
        throw new Error("params are required");
      }
      return getBuyHistory(params);
    },
    enabled: !!params,
  });
}
