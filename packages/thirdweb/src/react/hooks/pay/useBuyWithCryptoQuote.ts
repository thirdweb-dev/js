import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useContext } from "react";
import {
  getBuyWithCryptoQuote,
  type BuyWithCryptoQuote,
  type getBuyWithCryptoQuoteParams,
} from "../../../pay/buyWithCrypto/actions/getQuote.js";
import { ThirdwebProviderContext } from "../../providers/thirdweb-provider-ctx.js";

export type BuyWithCryptoQuoteQueryOptions = Omit<
  UseQueryOptions<BuyWithCryptoQuote>,
  "queryFn" | "queryKey" | "enabled"
>;
export type BuyWithCryptoQuoteQueryParams = Omit<
  getBuyWithCryptoQuoteParams,
  "client"
>;
/**
 * Hook to get a quote of type [`SwapQuote`](https://portal.thirdweb.com/references/typescript/v5/SwapQuote) for performing a token swap.
 * This quote contains the information about the swap such as token amounts, processing fees, estimated time etc.
 *
 * This hook is a React Query wrapper of the [`getSwapQuote`](https://portal.thirdweb.com/references/typescript/v5/getSwapQuote) function.
 * You can also use that function directly
 *
 * Once you have the quote, you can use the [`useSendSwapTransaction`](https://portal.thirdweb.com/references/typescript/v5/useSendSwapTransaction)
 * function to send the swap transaction and [`useSwapStatus`](https://portal.thirdweb.com/references/typescript/v5/useSwapStatus) function to get the status of the swap transaction.
 * @param buyWithCryptoParams - object of type [`GetSwapQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetSwapQuoteParams)
 * @param queryParams - options to configure the react query
 * @returns A React Query object which contains the data of type [`SwapQuote`](https://portal.thirdweb.com/references/typescript/v5/SwapQuote)
 * @example
 * ```tsx
 * import { useSendSwapTransaction, useSwapStatus, useBuyWithCryptoQuote, useSendSwapApproval } from "thirdweb/react";
 * import type { SwapTransaction } from "thirdweb";
 *
 * function Component() {
 *  const swapQuoteQuery = useBuyWithCryptoQuote(swapParams);
 *  const sendApproval = useSendSwapApproval();
 *  const sendSwap = useSendSwapTransaction();
 *
 *  const [swapTx, setSwapTx] = useState<SwapTransaction | undefined>();
 *  const swapStatusQuery = useSwapStatus(swapTx);
 *
 *  async function handleSwap() {
 *
 *    // if approval is required
 *    if (swapQuote.data.approval) {
 *      await sendApproval.mutateAsync(swapQuote.data.approval);
 *    }
 *
 *    // send the swap transaction
 *    // this promise is resolved when user confirms the transaction in the wallet and the transaction is sent to the blockchain
 *    const swapTransaction = await sendSwap.mutateAsync(swapQuote.data);
 *
 *    // set swapTx to poll the status of the swap transaction
 *    setSwapTx(swapTransaction);
 *  }
 *
 *  return <button onClick={handleSwap}>Swap</button>
 * }
 * ```
 */
export function useBuyWithCryptoQuote(
  buyWithCryptoParams?: BuyWithCryptoQuoteQueryParams,
  queryParams?: BuyWithCryptoQuoteQueryOptions,
): UseQueryResult<BuyWithCryptoQuote> {
  const context = useContext(ThirdwebProviderContext);

  return useQuery({
    ...queryParams,
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["buyWithCryptoQuote", buyWithCryptoParams],
    queryFn: () => {
      if (!buyWithCryptoParams) {
        throw new Error("Swap params are required");
      }
      if (!context?.client) {
        throw new Error("Please wrap the component in a ThirdwebProvider!");
      }
      return getBuyWithCryptoQuote({
        // typescript limitation with discriminated unions are collapsed
        ...(buyWithCryptoParams as getBuyWithCryptoQuoteParams),
        client: context.client,
      });
    },
    enabled: !!buyWithCryptoParams,
  });
}
