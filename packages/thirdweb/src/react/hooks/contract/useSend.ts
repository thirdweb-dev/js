import type { AbiFunction } from "abitype";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { Transaction } from "../../../transaction/transaction.js";
import { useActiveWallet } from "../../providers/wallet-provider.js";
import type { Hex } from "viem";
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
export function useSendTransaction<
  const abiFn extends AbiFunction,
>(): UseMutationResult<Awaited<Hex>, Error, Transaction<abiFn>> {
  const wallet = useActiveWallet();

  return useMutation({
    mutationFn: async (tx) => {
      if (!wallet) {
        throw new Error("No active wallet");
      }
      return await sendTransaction(tx, wallet);
    },
  });
}
