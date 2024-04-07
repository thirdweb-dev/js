import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { sendTransaction } from "../../../../transaction/actions/send-transaction.js";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { useActiveAccount } from "../wallets/wallet-hooks.js";

/**
 * A hook to send a transaction.
 * @returns A mutation object to send a transaction.
 * @example
 * ```jsx
 * import { useSendTransaction } from "thirdweb/react";
 * const { mutate: sendTx, data: transactionResult } = useSendTransaction();
 *
 * // later
 * sendTx(tx);
 * ```
 * @transaction
 */
export function useSendTransaction(): UseMutationResult<
  WaitForReceiptOptions,
  Error,
  PreparedTransaction
> {
  const account = useActiveAccount();

  return useMutation({
    mutationFn: async (transaction) => {
      if (!account) {
        throw new Error("No active account");
      }
      return await sendTransaction({
        transaction,
        account,
      });
    },
  });
}
