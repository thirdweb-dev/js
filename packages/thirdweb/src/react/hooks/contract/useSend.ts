import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useActiveWallet } from "../../providers/wallet-provider.js";
import type { WaitForReceiptOptions } from "../../../transaction/actions/wait-for-tx-receipt.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";

/**
 * A hook to send a transaction.
 * @returns A mutation object to send a transaction.
 * @example
 * ```jsx
 * import { useSendTransaction } from "thirdweb/react";
 * const { mutate: sendTx, data: transactionHash } = useSendTransaction();
 *
 * // later
 * const transactionHash = await sendTx(tx);
 * ```
 */
export function useSendTransaction(): UseMutationResult<
  WaitForReceiptOptions,
  Error,
  PreparedTransaction
> {
  const wallet = useActiveWallet();

  return useMutation({
    mutationFn: async (transaction) => {
      if (!wallet) {
        throw new Error("No active wallet");
      }
      return await sendTransaction({
        transaction,
        wallet,
      });
    },
  });
}
