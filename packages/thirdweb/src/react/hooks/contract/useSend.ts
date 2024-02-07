import type { Abi } from "abitype";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useActiveAccount } from "../../providers/wallet-provider.js";
import type { WaitForReceiptOptions } from "../../../transaction/actions/wait-for-tx-receipt.js";
import type { Transaction } from "../../../transaction/transaction.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";

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
  WaitForReceiptOptions<Abi>,
  Error,
  Transaction<any>
> {
  const account = useActiveAccount();

  return useMutation({
    mutationFn: async (transaction) => {
      if (!account) {
        throw new Error("No active wallet");
      }
      return await sendTransaction({
        transaction,
        account,
      });
    },
  });
}
