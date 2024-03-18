import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import {
  getBuyWithCryptoStatus,
  type BuyWithCryptoStatus,
  type BuyWithCryptoTransaction,
} from "../../../pay/buyWithCrypto/actions/getStatus.js";
import { ThirdwebProviderContext } from "../../providers/thirdweb-provider-ctx.js";

// TODO: use the estimate to vary the polling interval
const DEFAULT_POLL_INTERVAL = 5000;

type BuyWithCryptoStatusParams = Omit<BuyWithCryptoTransaction, "client">;

/**
 * A hook to get a status of swap transaction.
 * @param buyWithCryptoStatusParams - object of type [`BuyWithCryptoTransaction`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoTransaction)
 * @returns A react query object which contains the data of type [`BuyWithCryptoStatus`](https://portal.thirdweb.com/references/typescript/v5/BuyWithCryptoStatus)
 * @example
 * ```tsx
 * import { useBuyWithCryptoStatus, useBuyWithCryptoQuote } from "thirdweb/react";
 *
 * function Component() {
 *  const swapQuoteQuery = useBuyWithCryptoQuote(swapParams);
 *
 *  const [buyWithCryptoTx, setBuyWithCryptoTx] = useState< uyuWithCryptoTransaction | undefined>();
 *  const buyWithCryptoStatusQuery = useBuyWithCryptoStatus(buyWithCryptoTx);
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
 *    // set buyWithCryptoTx to poll the status of the swap transaction
 *    setBuyWithCryptoTx(swapTransaction);
 *  }
 *
 *  return <button onClick={handleSwap}>Swap</button>
 * }
 * ```
 */
export function useBuyWithCryptoStatus(
  buyWithCryptoStatusParams?: BuyWithCryptoStatusParams,
) {
  const [refetchInterval, setRefetchInterval] = useState<number>(
    DEFAULT_POLL_INTERVAL,
  );
  const context = useContext(ThirdwebProviderContext);

  return useQuery<BuyWithCryptoStatus, Error>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      "swapStatus",
      buyWithCryptoStatusParams?.transactionResult.transactionHash,
    ] as const,
    queryFn: async () => {
      if (!context?.client) {
        throw new Error("Please wrap the component in a ThirdwebProvider!");
      }
      if (!buyWithCryptoStatusParams) {
        throw new Error("Missing swap status params");
      }

      const swapStatus_ = await getBuyWithCryptoStatus({
        ...buyWithCryptoStatusParams,
        client: context.client,
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
