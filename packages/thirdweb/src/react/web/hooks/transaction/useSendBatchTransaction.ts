import type { UseMutationResult } from "@tanstack/react-query";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { useSendBatchTransactionCore } from "../../../core/hooks/transaction/useSendBatchTransaction.js";
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
  return useSendBatchTransactionCore(account);
}
