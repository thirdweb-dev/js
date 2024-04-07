import type { TransactionReceipt } from "../types.js";
import {
  type SendTransactionOptions,
  sendTransaction,
} from "./send-transaction.js";
import { waitForReceipt } from "./wait-for-tx-receipt.js";

/**
 * Sends a transaction using the provided wallet.
 * @param options - The options for sending the transaction.
 * @returns A promise that resolves to the confirmed transaction receipt.
 * @throws An error if the wallet is not connected.
 * @transaction
 * @example
 * ```ts
 * import { sendAndConfirmTransaction } from "thirdweb";
 *
 * const transactionReceipt = await sendAndConfirmTransaction({
 *  wallet,
 *  transaction
 * });
 * ```
 */
export async function sendAndConfirmTransaction(
  options: SendTransactionOptions,
): Promise<TransactionReceipt> {
  const submittedTx = await sendTransaction(options);
  return waitForReceipt(submittedTx);
}
