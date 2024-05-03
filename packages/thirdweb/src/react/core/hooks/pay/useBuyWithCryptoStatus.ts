import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  type BuyWithCryptoStatus,
  type BuyWithCryptoTransaction,
  getBuyWithCryptoStatus,
} from "../../../../pay/buyWithCrypto/getStatus.js";

// TODO: use the estimate to vary the polling interval
const DEFAULT_POLL_INTERVAL = 5000;

/**
 * A hook to get a status of a "Buy with crypto" transaction to determine if the transaction is completed, failed or pending.
 *
 * This hook is a React Query wrapper of the [`getBuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoStatus) function.
 * You can also use that function directly.
 * @param params - object of type [`BuyWithCryptoTransaction`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoTransaction)
 * @returns A react query object which contains the data of type [`BuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoStatus)
 * @example
 * ```tsx
 * import { useSendTransaction, useBuyWithCryptoQuote, useBuyWithCryptoStatus, type BuyWithCryptoStatusQueryParams } from "thirdweb/react";
 *
 * function Component() {
 *  const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote(swapParams);
 *  const sendTransactionMutation = useSendTransaction();
 *  const [buyTxHash, setBuyTxHash] = useState<BuyWithCryptoStatusQueryParams | undefined>();
 *  const buyWithCryptoStatusQuery = useBuyWithCryptoStatus(buyTxHash ? {
 *    client,
 *    transactionHash: buyTxHash,
 *  }: undefined);
 *
 *  async function handleBuyWithCrypto() {
 *
 *    // if approval is required
 *    if (buyWithCryptoQuoteQuery.data.approval) {
 *      const approveTx = await sendTransactionMutation.mutateAsync(swapQuote.data.approval);
 *      await waitForApproval(approveTx);
 *    }
 *
 *    // send the transaction to buy crypto
 *    // this promise is resolved when user confirms the transaction in the wallet and the transaction is sent to the blockchain
 *    const buyTx = await sendTransactionMutation.mutateAsync(swapQuote.data.transactionRequest);
 *    await waitForApproval(buyTx);
 *
 *    // set buyTx.transactionHash to poll the status of the swap transaction
 *    setBuyWithCryptoTx(buyTx.transactionHash);
 *  }
 *
 *  return <button onClick={handleBuyWithCrypto}>Swap</button>
 * }
 * ```
 * @buyCrypto
 */
export function useBuyWithCryptoStatus(params?: BuyWithCryptoTransaction) {
  const [refetchInterval, setRefetchInterval] = useState<number>(
    DEFAULT_POLL_INTERVAL,
  );

  return useQuery<BuyWithCryptoStatus, Error>({
    queryKey: ["swapStatus", params?.transactionHash] as const,
    queryFn: async () => {
      if (!params) {
        throw new Error("Missing swap status params");
      }
      if (!params?.client) {
        throw new Error("Missing client in swap status params");
      }

      const swapStatus_ = await getBuyWithCryptoStatus({
        ...params,
        client: params.client,
      });
      if (
        swapStatus_.status === "COMPLETED" ||
        swapStatus_.status === "FAILED"
      ) {
        setRefetchInterval(0);
      }
      return swapStatus_;
    },
    enabled: !!params,
    refetchInterval: refetchInterval,
    refetchIntervalInBackground: true,
    retry: true,
  });
}
