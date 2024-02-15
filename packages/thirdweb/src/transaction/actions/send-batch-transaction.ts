import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";
import type {
  Account,
  SendTransactionOption,
} from "../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import { encode } from "./encode.js";
import { getChainIdFromChain } from "../../chain/index.js";

type SendBatchTransactionOptions = {
  transactions: PreparedTransaction[];
  account: Account;
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
 * const transactionHash = await sendTransaction({
 *  account,
 *  transaction
 * });
 * ```
 */
export async function sendBatchTransaction(
  options: SendBatchTransactionOptions,
): Promise<WaitForReceiptOptions> {
  if (!options.account.address) {
    throw new Error("not connected");
  }
  if (options.transactions.length === 0) {
    throw new Error("No transactions to send");
  }
  const firstTx = options.transactions[0];
  if (!firstTx) {
    throw new Error("No transactions to send");
  }
  if (options.account.sendBatchTransaction) {
    const serializedTxs: SendTransactionOption[] = await Promise.all(
      options.transactions.map(async (tx) => {
        // no need to estimate gas for these, gas will be estimated on the entire batch
        const [data, to, accessList, value] = await Promise.all([
          encode(tx),
          resolvePromisedValue(tx.to),
          resolvePromisedValue(tx.accessList),
          resolvePromisedValue(tx.value),
        ]);
        const serializedTx: SendTransactionOption = {
          data,
          chainId: Number(getChainIdFromChain(tx.chain)),
          to,
          value,
          accessList,
        };
        return serializedTx;
      }),
    );
    const result = await options.account.sendBatchTransaction(serializedTxs);
    return {
      ...result,
      transaction: firstTx,
    };
  } else {
    throw new Error("Account doesn't implement sendBatchTransaction");
  }
}
