import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  type SwapStatus,
  type SwapTransaction,
  getSwapStatus,
} from "../../../pay/swap/actions/getStatus.js";

// TODO: use the estimate to vary the polling interval
const DEFAULT_POLL_INTERVAL = 5000;

/**
 * A hook to get a status of swap transaction.
 * @param swapStatusParams - object of type [`SwapTransaction`](https://portal.thirdweb.com/references/typescript/v5/SwapTransaction)
 * @returns A react query object which contains the data of type [`SwapStatus`](https://portal.thirdweb.com/references/typescript/v5/SwapStatus)
 * @example
 * ```tsx
 * import { useSendSwapTransaction, useSwapStatus, useSwapQuote, useSendSwapApproval } from "thirdweb/react";
 * import type { SwapTransaction } from "thirdweb";
 *
 * function Component() {
 *  const swapQuoteQuery = useSwapQuote(swapParams);
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
export function useSwapStatus(swapStatusParams: SwapTransaction | undefined) {
  const [refetchInterval, setRefetchInterval] = useState<number>(
    DEFAULT_POLL_INTERVAL,
  );

  return useQuery<SwapStatus, Error>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      "swapStatus",
      swapStatusParams?.transactionId,
      swapStatusParams?.transactionHash,
    ] as const,
    queryFn: async () => {
      if (!swapStatusParams) {
        throw new Error("Missing swap status params");
      }

      const swapStatus_ = await getSwapStatus(swapStatusParams);
      if (swapStatus_.status === "DONE" || swapStatus_.status === "FAILED") {
        setRefetchInterval(0);
      }
      return swapStatus_;
    },
    enabled: !!swapStatusParams,
    refetchInterval: refetchInterval,
    refetchIntervalInBackground: true,
    retry: true,
  });
}
