import { useQuery } from "@tanstack/react-query";
import {
  BuyWithCryptoStatus,
  BuyWithCryptoTransaction,
  getBuyWithCryptoStatus,
} from "@thirdweb-dev/sdk";
import { useState } from "react";

// TODO: use the estimate to vary the polling interval
const DEFAULT_POLL_INTERVAL = 5000;

export type BuyWithCryptoStatusQueryParams = BuyWithCryptoTransaction;

/**
 * A hook to get a status of swap transaction.
 *
 * This hook is a React Query wrapper of the [`getBuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v4/getBuyWithCryptoStatus) function.
 * You can also use that function directly.
 * @param buyWithCryptoStatusParams - object of type [`BuyWithCryptoStatusQueryParams`](https://portal.thirdweb.com/references/react/v4/BuyWithCryptoStatusQueryParams)
 * @returns A react query object which contains the data of type [`BuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoStatus)
 * @example
 * ```tsx
 * import { useSigner, useBuyWithCryptoQuote, useBuyWithCryptoStatus } from "@thirdweb-dev/react-core";
 *
 * function Component() {
 *   const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote* (swapParams);
 *   const signer = useSigner();
 *   const [buyTxHash, setBuyTxHash] = useState<string | undefined>();
 *   const buyWithCryptoStatusQuery = useBuyWithCryptoStatus* (buyTxHash ? {
 *     clientId: "YOUR_CLIENT_ID",
 *     transactionHash: buyTxHash,
 *   }: undefined);
 *
 *   async function handleBuyWithCrypto() {
 *     if (!buyWithCryptoQuoteQuery.data || !signer) {
 *       return;
 *     }
 *
 *     // if approval is required
 *     if (buyWithCryptoQuoteQuery.data.approval) {
 *       const approveTx = await signer.sendTransaction* (buyWithCryptoQuoteQuery.data.approval);
 *     }
 *
 *     // send the transaction to buy crypto
 *     // this promise is resolved when user confirms the transaction * in the wallet and the transaction is sent to the blockchain
 *     const buyTx = await signer.sendTransaction* (buyWithCryptoQuoteQuery.data.transactionRequest);
 *
 *     // set buyTx.transactionHash to poll the status of the swap * transaction
 *     setBuyTxHash(buyTx.hash);
 *   }
 *
 *   if (buyWithCryptoStatusQuery.data) {
 *     console.log('buyWithCryptoStatusQuery.data', * buyWithCryptoStatusQuery.data)
 *   }
 *     return <button onClick={handleBuyWithCrypto}>Swap</button>
 *  }
 * ```
 */
export function useBuyWithCryptoStatus(
  buyWithCryptoStatusParams?: BuyWithCryptoStatusQueryParams,
) {
  const [refetchInterval, setRefetchInterval] = useState<number>(
    DEFAULT_POLL_INTERVAL,
  );

  return useQuery<BuyWithCryptoStatus, Error>({
    queryKey: [
      "swapStatus",
      buyWithCryptoStatusParams?.transactionHash,
    ] as const,
    queryFn: async () => {
      if (!buyWithCryptoStatusParams) {
        throw new Error("Missing swap status params");
      }
      if (!buyWithCryptoStatusParams?.clientId) {
        throw new Error("Missing clientId in swap status params");
      }

      const swapStatus_ = await getBuyWithCryptoStatus({
        ...buyWithCryptoStatusParams,
        clientId: buyWithCryptoStatusParams.clientId,
      });
      if (
        swapStatus_.status === "COMPLETED" ||
        swapStatus_.status === "FAILED"
      ) {
        setRefetchInterval(0);
      }
      return swapStatus_;
    },
    enabled: !!buyWithCryptoStatusParams,
    refetchInterval: refetchInterval,
    refetchIntervalInBackground: true,
    retry: true,
  });
}
