import { useMutation } from "@tanstack/react-query";
import { useActiveWallet } from "../../providers/wallet-provider.js";
import type { SwapQuote } from "../../../pay/swap/actions/getSwap.js";
import { sendSwapTransaction } from "../../../pay/swap/actions/sendSwap.js";
import type { SwapTransaction } from "../../../pay/swap/actions/getStatus.js";

/**
 * A hook to send a swap transaction using active wallet.
 *
 * This hook is a wrapper of the [`sendSwapTransaction`](https://portal.thirdweb.com/references/typescript/v5/sendSwapTransaction) function. You can also use that function directly to send a swap transaction.
 * @returns a mutation function to send a swap transaction.
 * This mutation function returns a promise that resolves to object of type [`SwapTransaction`](https://portal.thirdweb.com/references/typescript/v5/SwapTransaction)
 * @example
 * ```tsx
 * import { useSendSwap } from "thirdweb/react";
 * import type { SwapTransaction } from "thirdweb";
 *
 * function Component() {
 *  const swapQuoteQuery = useSwapQuote(swapParams);
 *
 *  const sendSwap = useSendSwapTransaction();
 *
 *  const [swapTx, setSwapTx] = useState<SwapTransaction | undefined>();
 *  const swapStatusQuery = useSwapStatus(swapTx);
 *
 *  async function handleSwap() {
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
export function useSendSwapTransaction() {
  const wallet = useActiveWallet();

  return useMutation<SwapTransaction, Error, SwapQuote>({
    mutationFn: async (swapRoute: SwapQuote) => {
      if (!wallet) {
        throw new Error("Wallet not connected");
      }

      return sendSwapTransaction(wallet, swapRoute);
    },
  });
}
