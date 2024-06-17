import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { sendBatchTransaction } from "../../../../transaction/actions/send-batch-transaction.js";
import type { WaitForReceiptOptions } from "../../../../transaction/actions/wait-for-tx-receipt.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";

export function useSendBatchTransactionCore(
  account: Account | undefined,
): UseMutationResult<WaitForReceiptOptions, Error, PreparedTransaction[]> {
  return useMutation({
    mutationFn: async (transactions) => {
      if (!account) {
        throw new Error("No active account");
      }
      return await sendBatchTransaction({
        transactions,
        account,
      });
    },
  });
}
