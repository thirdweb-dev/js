import type { Abi, AbiFunction } from "abitype";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { Transaction } from "../../../transaction/transaction.js";
import { useActiveWallet } from "../../providers/wallet-provider.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import type { WaitForReceiptOptions } from "../../../transaction/actions/wait-for-tx-receipt.js";

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
export function useSendTransaction<
  abiFn extends AbiFunction,
>(): UseMutationResult<WaitForReceiptOptions<Abi>, Error, Transaction<abiFn>> {
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
