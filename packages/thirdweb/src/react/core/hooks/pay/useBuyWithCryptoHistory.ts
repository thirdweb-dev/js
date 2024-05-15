import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import {
  type BuyWithCryptoHistoryData,
  type BuyWithCryptoHistoryParams,
  getBuyWithCryptoHistory,
} from "../../../../pay/buyWithCrypto/getHistory.js";

/**
 * @internal
 */
export type BuyWithCryptoHistoryQueryOptions = Omit<
  UseQueryOptions<BuyWithCryptoHistoryData>,
  "queryFn" | "queryKey" | "enabled"
>;

/**
 * Hook to get the "Buy with crypto" transaction history for a given wallet address.
 *
 * This hook is a React Query wrapper of the [`getBuyWithCryptoHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoHistory) function.
 * You can also use that function directly
 * @param params - object of type [`BuyWithCryptoHistoryParams`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoHistoryParams)
 * @param queryParams - options to configure the react query
 * @returns A React Query object which contains the data of type [`BuyWithCryptoHistoryData`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoHistoryData)
 * @example
 * ```tsx
 * import { useBuyWithCryptoHistory } from "thirdweb/react";
 *
 * function Component() {
 *  const buyWithCryptoHistory = useBuyWithCryptoHistory(params);
 *  return <div> ... </div>
 * }
 * ```
 * @buyCrypto
 */
export function useBuyWithCryptoHistory(
  params?: BuyWithCryptoHistoryParams,
  queryParams?: BuyWithCryptoHistoryQueryOptions,
): UseQueryResult<BuyWithCryptoHistoryData> {
  return useQuery({
    ...queryParams,
    queryKey: ["getBuyWithCryptoHistory", params],
    queryFn: () => {
      if (!params) {
        throw new Error("Swap params are required");
      }
      return getBuyWithCryptoHistory(params);
    },
    enabled: !!params,
  });
}
