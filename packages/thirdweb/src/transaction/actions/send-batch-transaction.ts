import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type {
  Account,
  SendTransactionOption,
} from "../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import { encode } from "./encode.js";
import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";

export type SendBatchTransactionOptions = {
  transactions: PreparedTransaction[];
  account: Account;
};

/**
 * Sends a batch transaction using the provided options.
 * @param options - The options for sending the batch transaction.
 * @returns A promise that resolves to the options for waiting for the receipt of the first transaction in the batch.
 * @throws An error if the account is not connected, there are no transactions to send, or the account does not implement sendBatchTransaction.
 * @transaction
 * @example
 * ```ts
 * import { sendBatchTransaction } from "thirdweb";
 *
 * const waitForReceiptOptions = await sendBatchTransaction({
 *  account,
 *  transactions
 * });
 * ```
 */
export async function sendBatchTransaction(
  options: SendBatchTransactionOptions,
): Promise<WaitForReceiptOptions> {
  const { account, transactions } = options;
  if (!account) {
    throw new Error("not connected");
  }
  if (transactions.length === 0) {
    throw new Error("No transactions to send");
  }
  const firstTx = transactions[0];
  if (!firstTx) {
    throw new Error("No transactions to send");
  }
  if (account.sendBatchTransaction) {
    const serializedTxs: SendTransactionOption[] = await Promise.all(
      transactions.map(async (tx) => {
        // no need to estimate gas for these, gas will be estimated on the entire batch
        const [data, to, accessList, value] = await Promise.all([
          encode(tx),
          resolvePromisedValue(tx.to),
          resolvePromisedValue(tx.accessList),
          resolvePromisedValue(tx.value),
        ]);
        const serializedTx: SendTransactionOption = {
          data,
          chainId: tx.chain.id,
          to,
          value,
          accessList,
        };
        return serializedTx;
      }),
    );
    const result = await account.sendBatchTransaction(serializedTxs);
    return {
      ...result,
      chain: firstTx.chain,
      client: firstTx.client,
    };
  }
  throw new Error("Account doesn't implement sendBatchTransaction");
}
