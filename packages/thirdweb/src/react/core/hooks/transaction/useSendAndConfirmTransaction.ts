import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../../../transaction/types.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";

export function useSendAndConfirmTransactionCore(
  account: Account | undefined,
): UseMutationResult<TransactionReceipt, Error, PreparedTransaction> {
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
