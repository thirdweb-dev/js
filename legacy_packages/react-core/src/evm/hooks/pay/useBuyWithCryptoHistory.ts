import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  BuyWithCryptoHistoryData,
  BuyWithCryptoHistoryParams,
  getBuyWithCryptoHistory,
} from "@thirdweb-dev/sdk";

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
 * import { useBuyWithCryptoHistory } from "@thirdweb-dev/react-core";
 *
 * function Component() {
 *  const buyWithCryptoHistory = useBuyWithCryptoHistory(params);
 *  return <pre>{JSON.stringify(buyWithCryptoHistory.data, null, 2)}</pre>
 * }
 * ```
 */
export function useBuyWithCryptoHistory(
  buyWithCryptoHistoryParams?: BuyWithCryptoHistoryQueryParams,
  queryParams?: BuyWithCryptoQuoteQueryOptions,
): UseQueryResult<BuyWithCryptoHistoryData> {
  return useQuery<BuyWithCryptoHistoryData>({
    ...queryParams,
    queryKey: ["buyWithCryptoHistory", buyWithCryptoHistoryParams] as const,
    queryFn: () => {
      if (!buyWithCryptoHistoryParams) {
        throw new Error("Swap params are required");
      }
      return getBuyWithCryptoHistory(buyWithCryptoHistoryParams);
    },
    enabled: !!buyWithCryptoHistoryParams,
  });
}
