import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import {
  type BuyWithCryptoQuote,
  type GetBuyWithCryptoQuoteParams,
  getBuyWithCryptoQuote,
} from "../../../../pay/buyWithCrypto/actions/getQuote.js";

export type BuyWithCryptoQuoteQueryOptions = Omit<
  UseQueryOptions<BuyWithCryptoQuote>,
  "queryFn" | "queryKey" | "enabled"
>;
export type BuyWithCryptoQuoteQueryParams = GetBuyWithCryptoQuoteParams;
/**
 * Hook to get a quote of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote) for buying tokens with crypto.
 * This quote contains the information about the purchase such as token amounts, processing fees, estimated time etc.
 *
 * This hook is a React Query wrapper of the [`getBuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/getBuyWithCryptoQuote) function.
 * You can also use that function directly
 *
 * Once you have the quote, you can use the [`useSendTransaction`](https://portal.thirdweb.com/references/typescript/v5/useSendTransaction) function to send the purchase
 * and [`useBuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/useBuyWithCryptoStatus) function to get the status of the swap transaction.
 * @param buyWithCryptoParams - object of type [`BuyWithCryptoQuoteQueryParams`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuoteQueryParams)
 * @param queryParams - options to configure the react query
 * @returns A React Query object which contains the data of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoQuote)
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
export function useBuyWithCryptoQuote(
  buyWithCryptoParams?: BuyWithCryptoQuoteQueryParams,
  queryParams?: BuyWithCryptoQuoteQueryOptions,
): UseQueryResult<BuyWithCryptoQuote> {
  return useQuery({
    ...queryParams,

    queryKey: ["buyWithCryptoQuote", buyWithCryptoParams],
    queryFn: () => {
      if (!buyWithCryptoParams) {
        throw new Error("Swap params are required");
      }
      if (!buyWithCryptoParams?.client) {
        throw new Error("Client is required in swap params");
      }
      return getBuyWithCryptoQuote({
        // typescript limitation with discriminated unions are collapsed
        ...(buyWithCryptoParams as GetBuyWithCryptoQuoteParams),
        client: buyWithCryptoParams.client,
      });
    },
    enabled: !!buyWithCryptoParams,
  });
}
