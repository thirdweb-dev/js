import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  BuyWithCryptoQuote,
  getBuyWithCryptoQuote,
  GetBuyWithCryptoQuoteParams,
} from "@thirdweb-dev/sdk";

export type BuyWithCryptoQuoteQueryParams = GetBuyWithCryptoQuoteParams;
/**
 * Hook to get a quote of type [`BuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v4/BuyWithCryptoQuote) for buying tokens with crypto.
 * This quote contains the information about the purchase such as token amounts, processing fees, estimated time etc.
 *
 * This hook is a React Query wrapper of the [`getBuyWithCryptoQuote`](https://portal.thirdweb.com/references/typescript/v4/getBuyWithCryptoQuote) function.
 * You can also use that function directly
 *
 * Once you have the quote, you can use the [`useBuyWithCryptoStatus`](https://portal.thirdweb.com/references/react/v4/useBuyWithCryptoStatus) function to get the status of the swap transaction.
 * @param buyWithCryptoParams - object of type [`BuyWithCryptoQuoteQueryParams`](https://portal.thirdweb.com/references/react/v4/BuyWithCryptoQuoteQueryParams)
 * @param queryParams - options to configure the react query
 * @returns A React Query object which contains the data of type [`GetBuyWithCryptoQuoteParams`](https://portal.thirdweb.com/references/typescript/v4/GetBuyWithCryptoQuoteParams)
 * @example
 * ```tsx
 * import { useSigner, useBuyWithCryptoQuote, useBuyWithCryptoStatus, type BuyWithCryptoStatusQueryParams } from "@thirdweb-dev/react-core";
 *
 * function Component() {
 *  const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote(swapParams);
 *  const signer = useSigner();
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
 *      const approveTx = await signer.sendTransaction(swapQuote.data.approval);
 *    }
 *
 *    // send the transaction to buy crypto
 *    // this promise is resolved when user confirms the transaction in the wallet and the transaction is sent to the blockchain
 *    const buyTx = await signer.sendTransaction(swapQuote.data.transactionRequest);
 *
 *    // set buyTx.transactionHash to poll the status of the swap transaction
 *    setBuyWithCryptoTx(buyTx.transactionHash);
 *  }
 *
 *  return <button onClick={handleBuyWithCrypto}>Swap</button>
 * }
 * ```
 */
export function useBuyWithCryptoQuote(
  buyWithCryptoParams?: BuyWithCryptoQuoteQueryParams,
): UseQueryResult<BuyWithCryptoQuote> {
  return useQuery({
    queryKey: ["buyWithCryptoQuote", buyWithCryptoParams],
    queryFn: () => {
      if (!buyWithCryptoParams) {
        throw new Error("Swap params are required");
      }
      if (!buyWithCryptoParams?.clientId) {
        throw new Error("Client ID is required in swap params");
      }
      return getBuyWithCryptoQuote({
        ...(buyWithCryptoParams as GetBuyWithCryptoQuoteParams),
        clientId: buyWithCryptoParams.clientId,
      });
    },
    enabled: !!buyWithCryptoParams,
  });
}
