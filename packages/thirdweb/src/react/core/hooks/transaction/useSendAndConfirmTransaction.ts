import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import type { GaslessOptions } from "../../../../transaction/actions/gasless/types.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import type { TransactionReceipt } from "../../../../transaction/types.js";
import { useActiveAccount } from "../wallets/useActiveAccount.js";

/**
 * Configuration for the `useSendTransaction` hook.
 */
type SendAndConfirmTransactionConfig = {
  /**
   * Configuration for gasless transactions.
   * Refer to [`GaslessOptions`](https://portal.thirdweb.com/references/typescript/v5/GaslessOptions) for more details.
   */
  gasless?: GaslessOptions;
};

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
 *
 *
 * ### Gasless usage with [thirdweb Engine](https://portal.thirdweb.com/engine)
 * ```tsx
 * import { useSendAndConfirmTransaction } from "thirdweb/react";
 * const mutation = useSendAndConfirmTransaction({
 *   gasless: {
 *     provider: "engine",
 *     relayerUrl: "https://thirdweb.engine-***.thirdweb.com/relayer/***",
 *     relayerForwarderAddress: "0x...",
 *   }
 * });
 * ```
 *
 * ### Gasless usage with OpenZeppelin
 * ```tsx
 * import { useSendAndConfirmTransaction } from "thirdweb/react";
 * const mutation = useSendAndConfirmTransaction({
 *   gasless: {
 *     provider: "openzeppelin",
 *     relayerUrl: "https://...",
 *     relayerForwarderAddress: "0x...",
 *   }
 * });
 * ```
 * @transaction
 */
export function useSendAndConfirmTransaction(
  config: SendAndConfirmTransactionConfig = {},
): UseMutationResult<TransactionReceipt, Error, PreparedTransaction> {
  const account = useActiveAccount();
  const { gasless } = config;
  return useMutation({
    mutationFn: async (transaction) => {
      if (!account) {
        throw new Error("No active account");
      }
      return await sendAndConfirmTransaction({
        account,
        gasless,
        transaction,
      });
    },
  });
}
