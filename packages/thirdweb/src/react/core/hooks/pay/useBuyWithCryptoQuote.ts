import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import {
  type BuyWithCryptoQuote,
  type GetBuyWithCryptoQuoteParams,
  getBuyWithCryptoQuote,
} from "../../../../pay/buyWithCrypto/getQuote.js";

/**
 * @internal
 */
export type BuyWithCryptoQuoteQueryOptions = Omit<
  UseQueryOptions<BuyWithCryptoQuote>,
  "queryFn" | "queryKey" | "enabled"
>;

/**
 * Hook to get a price quote for performing a "Buy with crypto" transaction that allows users to buy a token with another token - aka a swap.
 *
 * The price quote is an object of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote).
 * This quote contains the information about the purchase such as token amounts, processing fees, estimated time etc.
 *
 * This hook is a React Query wrapper of the [`getBuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoQuote) function.
 * You can also use that function directly
 *
 * Once you have the quote, you can use the [`useSendTransaction`](https://portal.thirdweb.com/references/typescript/v5/useSendTransaction) function to send the purchase
 * and [`useBuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/useBuyWithCryptoStatus) function to get the status of the swap transaction.
 * @param params - object of type [`BuyWithCryptoQuoteQueryParams`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuoteQueryParams)
 * @param queryParams - options to configure the react query
 * @returns A React Query object which contains the data of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote)
 * @example
 * ```tsx
 * import { useBuyWithCryptoQuote, useBuyWithCryptoStatus, type BuyWithCryptoStatusQueryParams, useActiveAccount } from "thirdweb/react";
 * import { sendTransaction } from 'thirdweb';
 *
 * function Component() {
 *  const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote(swapParams);
 *  const [buyTxHash, setBuyTxHash] = useState<BuyWithCryptoStatusQueryParams | undefined>();
 *  const buyWithCryptoStatusQuery = useBuyWithCryptoStatus(buyTxHash ? {
 *    client,
 *    transactionHash: buyTxHash,
 *  }: undefined);
 *
 *  async function handleBuyWithCrypto() {
 *    const account = useActiveAccount();
 *
 *    // if approval is required
 *    if (buyWithCryptoQuoteQuery.data.approval) {
 *      const approveTx = await sendTransaction({
 *        transaction: swapQuote.data.approval,
 *        account: account,
 *      });
 *      await waitForApproval(approveTx);
 *    }
 *
 *    // send the transaction to buy crypto
 *    // this promise is resolved when user confirms the transaction in the wallet and the transaction is sent to the blockchain
 *    const buyTx = await sendTransaction({
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
export function useBuyWithCryptoQuote(
  params?: GetBuyWithCryptoQuoteParams,
  queryParams?: BuyWithCryptoQuoteQueryOptions,
): UseQueryResult<BuyWithCryptoQuote> {
  return useQuery({
    ...queryParams,
    queryKey: ["buyWithCryptoQuote", params],
    queryFn: () => {
      if (!params) {
        throw new Error("Swap params are required");
      }

      return getBuyWithCryptoQuote(params);
    },
    enabled: !!params,
    retry(failureCount, error) {
      if (failureCount > 3) {
        return false;
      }

      if (error.message.includes("Minimum purchase")) {
        return false;
      }

      return true;
    },
  });
}
