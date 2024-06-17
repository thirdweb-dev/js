import type { UseMutationResult } from "@tanstack/react-query";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../../../transaction/types.js";
import { useSendAndConfirmTransactionCore } from "../../../core/hooks/transaction/useSendAndConfirmTransaction.js";
import { useActiveAccount } from "../wallets/useActiveAccount.js";

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
  return useSendAndConfirmTransactionCore(account);
}
