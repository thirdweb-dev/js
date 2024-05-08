import { useQuery } from "@tanstack/react-query";
import {
  type BuyWithCryptoStatus,
  type BuyWithCryptoTransaction,
  getBuyWithCryptoStatus,
} from "../../../../pay/buyWithCrypto/getStatus.js";

/**
 * A hook to get a status of a "Buy with crypto" transaction to determine if the transaction is completed, failed or pending.
 *
 * This hook is a React Query wrapper of the [`getBuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoStatus) function.
 * You can also use that function directly.
 * @param params - object of type [`BuyWithCryptoTransaction`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoTransaction)
 * @returns A react query object which contains the data of type [`BuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoStatus)
 * @example
 * ```tsx
 * import { useSendTransaction, useBuyWithCryptoQuote, useBuyWithCryptoStatus, type BuyWithCryptoStatusQueryParams, useActiveAccount } from "thirdweb/react";
 * import { sendTransaction } from 'thirdweb';
 *
 * function Component() {
 *  const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote(swapParams);
 *  const [buyTxHash, setBuyTxHash] = useState<BuyWithCryptoStatusQueryParams | undefined>();
 *  const buyWithCryptoStatusQuery = useBuyWithCryptoStatus(buyTxHash ? {
 *    client,
 *    transactionHash: buyTxHash,
 *  }: undefined);
 *  const account = useActiveAccount();
 *
 *  async function handleBuyWithCrypto() {
 *
 *    // if approval is required
 *    if (buyWithCryptoQuoteQuery.data.approval) {
 *      const approveTx = await sendTransaction({
 *        account: account,
 *        transaction: swapQuote.data.approval,
 *      });
 *      await waitForApproval(approveTx);
 *    }
 *
 *    // send the transaction to buy crypto
 *    // this promise is resolved when user confirms the transaction in the wallet and the transaction is sent to the blockchain
 *    const buyTx = await sendTransactionMutation.mutateAsync({
 *      transaction: swapQuote.data.transactionRequest,
 *      account: account,
 *    });
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
  return useQuery<BuyWithCryptoStatus, Error>({
    queryKey: ["getBuyWithCryptoStatus", params?.transactionHash] as const,
    queryFn: async () => {
      if (!params) {
        throw new Error("No params");
      }
      return getBuyWithCryptoStatus(params);
    },
    enabled: !!params,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    retry: true,
  });
}
