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

type BuyWithCryptoHistoryQueryOptions = Omit<
  UseQueryOptions<BuyWithCryptoHistoryData>,
  "queryFn" | "queryKey" | "enabled"
>;

/**
 * Hook to get the history of purchases a given wallet has performed.
 *
 * This hook is a React Query wrapper of the [`getBuyWithCryptoHistory`](https://portal.thirdweb.com/references/typescript/v4/getBuyWithCryptoHistory) function.
 * You can also use that function directly
 * @param params - object of type [`BuyWithCryptoHistoryParams`](https://portal.thirdweb.com/references/typescript/v4/BuyWithCryptoHistoryParams)
 * @param queryParams - options to configure the react query
 * @returns A React Query object which contains the data of type [`BuyWithCryptoHistoryData`](https://portal.thirdweb.com/references/typescript/v4/BuyWithCryptoHistoryData)
 * @example
 * ```tsx
 * import { useBuyWithCryptoHistory } from "@thirdweb-dev/react";
 *
 * function Component() {
 *  const buyWithCryptoHistory = useBuyWithCryptoHistory(params);
 *  console.log(buyWithCryptoHistory.data);
 *  return <div> ... </div>;
 * }
 * ```
 */
export function useBuyWithCryptoHistory(
  params?: BuyWithCryptoHistoryParams,
  queryParams?: BuyWithCryptoHistoryQueryOptions,
): UseQueryResult<BuyWithCryptoHistoryData> {
  return useQuery<BuyWithCryptoHistoryData>({
    ...queryParams,
    queryKey: ["buyWithCryptoHistory", params] as const,
    queryFn: () => {
      if (!params) {
        throw new Error("Swap params are required");
      }
      return getBuyWithCryptoHistory(params);
    },
    enabled: !!params,
  });
}
