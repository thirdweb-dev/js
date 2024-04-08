import type { Account } from "../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";

import { toSerializableTransaction } from "./to-serializable-transaction.js";

export type SendTransactionOptions = {
  account: Account;
  // TODO: update this to `Transaction<"prepared">` once the type is available to ensure only prepared transactions are accepted
  // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any prepared transaction type
  transaction: PreparedTransaction<any>;
};

/**
 * Sends a transaction using the provided wallet.
 * @param options - The options for sending the transaction.
 * @returns A promise that resolves to the transaction hash.
 * @throws An error if the wallet is not connected.
 * @transaction
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 *
 * const { transactionHash } = await sendTransaction({
 *  account,
 *  transaction
 * });
 * ```
 */
export async function sendTransaction(
  options: SendTransactionOptions,
): Promise<WaitForReceiptOptions> {
  const { account, transaction } = options;

  const serializableTx = await toSerializableTransaction({
    transaction: transaction,
    from: account.address,
  });
  const result = await account.sendTransaction(serializableTx);
  return { ...result, chain: transaction.chain, client: transaction.client };
}
