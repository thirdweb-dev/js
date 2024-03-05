import { useQuery } from "@tanstack/react-query";
import {
  getSwapQuote,
  type GetSwapQuoteParams,
} from "../../../pay/swap/actions/getSwap.js";

/**
 * Hook to get a quote of type [`SwapQuote`](https://portal.thirdweb.com/references/typescript/v5/SwapQuote) for performing a token swap.
 * This quote contains the information about the swap such as token amounts, processing fees, estimated time etc.
 *
 * This hook is a React Query wrapper of the [`getSwapQuote`](https://portal.thirdweb.com/references/typescript/v5/getSwapQuote) function.
 * You can also use that function directly
 *
 * Once you have the quote, you can use the [`useSendSwapTransaction`](https://portal.thirdweb.com/references/typescript/v5/useSendSwapTransaction)
 * function to send the swap transaction and [`useSwapStatus`](https://portal.thirdweb.com/references/typescript/v5/useSwapStatus) function to get the status of the swap transaction.
 * @param swapParams - object of type [`GetSwapQuoteParams`](https://portal.thirdweb.com/references/typescript/v5/GetSwapQuoteParams)
 * @returns A React Query object which contains the data of type [`SwapQuote`](https://portal.thirdweb.com/references/typescript/v5/SwapQuote)
 * @example
 * ```tsx
 * import { useSendSwap } from "thirdweb/react";
 * import type { SwapTransaction } from "thirdweb";
 *
 * function Component() {
 *  const swapQuoteQuery = useSwapQuote(swapParams);
 *
 *  const sendSwap = useSendSwapTransaction();
 *
 *  const [swapTx, setSwapTx] = useState<SwapTransaction | undefined>();
 *  const swapStatusQuery = useSwapStatus(swapTx);
 *
 *  async function handleSwap() {
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
export function useSwapQuote(swapParams?: GetSwapQuoteParams) {
  return useQuery({
    queryKey: ["swapQuote", swapParams],
    queryFn: () => {
      if (!swapParams) {
        throw new Error("Swap params are required");
      }
      return getSwapQuote(swapParams);
    },
    enabled: !!swapParams,
  });
}
