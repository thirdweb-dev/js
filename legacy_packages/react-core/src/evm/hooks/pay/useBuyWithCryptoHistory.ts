import { useQuery } from "@tanstack/react-query";
import {
  BuyWithCryptoHistoryData,
  BuyWithCryptoHistoryParams,
  getBuyWithCryptoHistory,
} from "@thirdweb-dev/sdk";

export type BuyWithCryptoHistoryQueryParams = BuyWithCryptoHistoryParams;

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
) {
  return useQuery<BuyWithCryptoHistoryData, Error>({
    queryKey: ["buyWithCryptoHistory", buyWithCryptoHistoryParams],
    queryFn: () => {
      if (!buyWithCryptoHistoryParams) {
        throw new Error("Swap params are required");
      }
      if (!buyWithCryptoHistoryParams?.clientId) {
        throw new Error("clientId is required");
      }
      return getBuyWithCryptoHistory({
        ...buyWithCryptoHistoryParams,
        clientId: buyWithCryptoHistoryParams.clientId,
      });
    },
    enabled: !!buyWithCryptoHistoryParams,
  });
}
