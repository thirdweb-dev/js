import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useContext } from "react";
import {
  getBuyWithCryptoHistory,
  type WalletSwapHistoryData,
  type WalletSwapHistoryParams,
} from "../../../pay/buyWithCrypto/actions/getHistory.js";
import { ThirdwebProviderContext } from "../../providers/thirdweb-provider-ctx.js";

export type BuyWithCryptoHistoryQueryParams = Omit<
  WalletSwapHistoryParams,
  "client"
>;
export type BuyWithCryptoQuoteQueryOptions = Omit<
  UseQueryOptions<WalletSwapHistoryData>,
  "queryFn" | "queryKey" | "enabled"
>;

/**
 * Hook to get the history of purchases a given wallet has performed.
 *
 * This hook is a React Query wrapper of the [`getBuyWithCryptoHistory`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoHistory) function.
 * You can also use that function directly
 * @param buyWithCryptoHistoryParams - object of type [`WalletSwapHistoryParams`](https://portal.thirdweb.com/references/typescript/v5/WalletSwapHistoryParams)
 * @param queryParams - options to configure the react query
 * @returns A React Query object which contains the data of type [`WalletSwapHistoryData`](https://portal.thirdweb.com/references/typescript/v5/WalletSwapHistoryData)
 * @example
 * ```tsx
 * import { useBuyWithCryptoHistory } from "thirdweb/react";
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
): UseQueryResult<WalletSwapHistoryData> {
  const context = useContext(ThirdwebProviderContext);
  return useQuery({
    ...queryParams,
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["buyWithCryptoHistory", buyWithCryptoHistoryParams],
    queryFn: () => {
      if (!context?.client) {
        throw new Error("Please wrap the component in a ThirdwebProvider!");
      }
      if (!buyWithCryptoHistoryParams) {
        throw new Error("Swap params are required");
      }
      return getBuyWithCryptoHistory({
        ...buyWithCryptoHistoryParams,
        client: context.client,
      });
    },
    enabled: !!buyWithCryptoHistoryParams,
  });
}
