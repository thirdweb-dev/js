import type { Account } from "../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import { addTransactionToStore } from "../transaction-store.js";
import type { GaslessOptions } from "./gasless/types.js";
import { toSerializableTransaction } from "./to-serializable-transaction.js";
import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";

export type SendTransactionOptions = {
  account: Account;
  // TODO: update this to `Transaction<"prepared">` once the type is available to ensure only prepared transactions are accepted
  // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any prepared transaction type
  transaction: PreparedTransaction<any>;
  gasless?: GaslessOptions;
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
  const { account, transaction, gasless } = options;

  if (account.onTransactionRequested) {
    await account.onTransactionRequested(transaction);
  }

  const serializableTransaction = await toSerializableTransaction({
    transaction: transaction,
    from: account.address,
  });

  // branch for gasless transactions
  if (gasless) {
    // lazy load the gasless tx function because it's only needed for gasless transactions
    const { sendGaslessTransaction } = await import(
      "./gasless/send-gasless-transaction.js"
    );
    return sendGaslessTransaction({
      account,
      transaction,
      serializableTransaction,
      gasless,
    });
  }

  const result = await account.sendTransaction(serializableTransaction);
  // Store the transaction
  addTransactionToStore({
    address: account.address,
    transactionHash: result.transactionHash,
    chainId: transaction.chain.id,
  });
  return { ...result, chain: transaction.chain, client: transaction.client };
}
