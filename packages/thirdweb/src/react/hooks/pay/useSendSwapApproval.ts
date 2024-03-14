import { useMutation } from "@tanstack/react-query";
import type { TransactionReceipt } from "viem";
import type { QuoteApprovalParams } from "../../../pay/quote/actions/getQuote.js";
import { sendQuoteApproval } from "../../../pay/quote/actions/sendQuoteApproval.js";
import { useActiveWallet } from "../../providers/wallet-provider.js";

/**
 * Send a Swap Approval request using the connected wallet to approve the tokens for swapping.
 *
 * This hook is a wrapper of the [`sendSwapApproval`](https://portal.thirdweb.com/references/typescript/v5/sendSwapApproval) function. You can also use that function directly to send a swap approval request.
 * @returns a mutation function to send a swap transaction.
 * This mutation function returns a promise that resolves to object of type [`TransactionReceipt`](https://portal.thirdweb.com/references/typescript/v5/TransactionReceipt)
 * @example
 * ```tsx
 * import { useSendSwapTransaction, useSwapStatus, useSwapQuote, useSendSwapApproval } from "thirdweb/react";
 * import type { SwapTransaction } from "thirdweb";
 *
 * function Component() {
 *  const swapQuoteQuery = useSwapQuote(swapParams);
 *  const sendApproval = useSendSwapApproval();
 *  const sendSwap = useSendSwapTransaction();
 *
 *  const [swapTx, setSwapTx] = useState<SwapTransaction | undefined>();
 *  const swapStatusQuery = useSwapStatus(swapTx);
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
 *    // set swapTx to poll the status of the swap transaction
 *    setSwapTx(swapTransaction);
 *  }
 *
 *  return <button onClick={handleSwap}>Swap</button>
 * }
 * ```
 */
export function useSendSwapApproval() {
  const wallet = useActiveWallet();

  return useMutation<TransactionReceipt, Error, QuoteApprovalParams>({
    mutationFn: async (params: QuoteApprovalParams) => {
      if (!wallet) {
        throw new Error("Wallet not connected");
      }

      return sendQuoteApproval(wallet, params);
    },
  });
}
