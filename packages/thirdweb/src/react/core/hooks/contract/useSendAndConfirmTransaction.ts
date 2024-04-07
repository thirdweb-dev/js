import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../../../transaction/types.js";
import { useActiveAccount } from "../wallets/wallet-hooks.js";

/**
 * A hook to send a transaction.
 * @returns A mutation object to send a transaction.
 * @example
 * ```jsx
 * import { useSendAndConfirmTransaction } from "thirdweb/react";
 * const { mutate: sendAndConfirmTx, data: transactionReceipt } = useSendAndConfirmTransaction();
 *
 * // later
 * sendAndConfirmTx(tx);
 * ```
 * @transaction
 */
export function useSendAndConfirmTransaction(): UseMutationResult<
  TransactionReceipt,
  Error,
  PreparedTransaction
> {
  const account = useActiveAccount();

  return useMutation({
    mutationFn: async (transaction) => {
      if (!account) {
        throw new Error("No active account");
      }
      return await sendAndConfirmTransaction({
        transaction,
        account,
      });
    },
  });
}
