import { useQuery } from "@tanstack/react-query";
import {
  BuyWithCryptoStatus,
  BuyWithCryptoTransaction,
  getBuyWithCryptoStatus,
} from "@thirdweb-dev/sdk";
import { useState } from "react";

// TODO: use the estimate to vary the polling interval
const DEFAULT_POLL_INTERVAL = 5000;

/**
 * A hook to get a status of Buy with Crypto transaction.
 *
 * This hook is a React Query wrapper of the [`getBuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v4/getBuyWithCryptoStatus) function.
 * You can also use that function directly.
 * @param params - object of type [`BuyWithCryptoTransaction`](https://portal.thirdweb.com/references/react/v4/BuyWithCryptoTransaction)
 * @returns A react query object which contains the data of type [`BuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v4/BuyWithCryptoStatus)
 * @example
 * ```tsx
 * import { useSigner, useBuyWithCryptoQuote, useBuyWithCryptoStatus } from "@thirdweb-dev/react";
 *
 * function Component() {
 *   const buyWithCryptoQuoteQuery = useBuyWithCryptoQuote(swapParams);
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
 *       const approveTx = await signer.sendTransaction(buyWithCryptoQuoteQuery.data.approval);
 *       await approveTx.wait();
 *     }
 *
 *     // send the transaction to buy crypto
 *     // this promise is resolved when user confirms the transaction * in the wallet and the transaction is sent to the blockchain
 *     const buyTx = await signer.sendTransaction(buyWithCryptoQuoteQuery.data.transactionRequest);
 *     await buyTx.wait();
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
      if (!params?.clientId) {
        throw new Error("Missing clientId in swap status params");
      }

      const swapStatus_ = await getBuyWithCryptoStatus({
        ...params,
        clientId: params.clientId,
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
