import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { sendBatchTransaction } from "../../../../transaction/actions/send-batch-transaction.js";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { useActiveAccount } from "../wallets/useActiveAccount.js";

/**
 * A hook to send a transaction.
 * @returns A mutation object to send a transaction.
 * @example
 * ```jsx
 * import { useSendBatchTransaction } from "thirdweb/react";
 * const { mutate: sendBatch, data: transactionResult } = useSendBatchTransaction();
 *
 * // later
 * sendBatch([tx1, tx2]);
 * ```
 * @transaction
 */
export function useSendBatchTransaction(): UseMutationResult<
  WaitForReceiptOptions,
  Error,
  PreparedTransaction[]
> {
  const account = useActiveAccount();
  return useMutation({
    mutationFn: async (transactions) => {
      if (!account) {
        throw new Error("No active account");
      }
      return await sendBatchTransaction({
        account,
        transactions,
      });
    },
  });
}
