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
 *
 * ### Basic usage
 * ```ts
 * import { sendAndConfirmTransaction } from "thirdweb";
 *
 * const transactionReceipt = await sendAndConfirmTransaction({
 *  account,
 *  transaction
 * });
 * ```
 *
 * ### Gasless usage with [thirdweb Engine](https://portal.thirdweb.com/engine)
 * ```ts
 * const transactionReceipt = await sendAndConfirmTransaction({
 *  account,
 *  transaction,
 *  gasless: {
 *    provider: "engine",
 *    relayerUrl: "https://thirdweb.engine-***.thirdweb.com/relayer/***",
 *    relayerForwarderAddress: "0x...",
 *  }
 * });
 * ```
 *
 * ### Gasless usage with OpenZeppelin
 * ```ts
 * const transactionReceipt = await sendAndConfirmTransaction({
 *  account,
 *  transaction,
 *  gasless: {
 *    provider: "openzeppelin",
 *    relayerUrl: "https://...",
 *    relayerForwarderAddress: "0x...",
 *  }
 * });
 * ```
 */
export async function sendAndConfirmTransaction(
  options: SendTransactionOptions,
): Promise<TransactionReceipt> {
  const submittedTx = await sendTransaction(options);
  return waitForReceipt(submittedTx);
}
