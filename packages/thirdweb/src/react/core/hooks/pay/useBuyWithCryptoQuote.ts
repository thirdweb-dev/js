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
} from "../../../../pay/buyWithCrypto/actions/getQuote.js";
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
 *  const [buyWithCryptoTx, setBuyWithCryptoTx] = useState<BuyWithCryptoStatusQueryParams | undefined>();
 *  const buyWithCryptoStatusQuery = useBuyWithCryptoStatus(buyWithCryptoTx);
 *
 *  async function handleBuyWithCrypto() {
 *
 *    // if approval is required
 *    if (buyWithCryptoQuoteQuery.data.approval) {
 *      await sendTransactionMutation.mutateAsync(swapQuote.data.approval);
 *    }
 *
 *    // send the transaction to buy crypto
 *    // this promise is resolved when user confirms the transaction in the wallet and the transaction is sent to the blockchain
 *    const buyWithCryptoTxn = await sendTransactionMutation.mutateAsync(swapQuote.data.transactionRequest);
 *
 *    // set buyWithCryptoTx to poll the status of the swap transaction
 *    setBuyWithCryptoTx({transactionHash: buyWithCryptoTxn.transactionHash ?? buyWithCryptoTxn.userOpHash});
 *  }
 *
 *  return <button onClick={handleBuyWithCrypto}>Swap</button>
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
