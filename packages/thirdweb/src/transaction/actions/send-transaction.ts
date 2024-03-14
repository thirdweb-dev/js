import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";
import type { Account, Wallet } from "../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import type { Prettify } from "../../utils/type-utils.js";
import { toSerializableTransaction } from "./to-serializable-transaction.js";

export type SendTransactionOptions = Prettify<
  {
    transaction: PreparedTransaction<any>;
  } & (
    | {
        account?: never;
        wallet: Wallet;
      }
    | {
        account: Account;
        wallet?: never;
      }
  )
>;

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
export async function sendTransaction(
  options: SendTransactionOptions,
): Promise<WaitForReceiptOptions> {
  const account = options.account ?? options.wallet.getAccount();
  if (!account) {
    throw new Error("not connected");
  }

  const walletChainId = options.wallet?.getChain()?.id;
  const chainId = options.transaction.chain.id;
  // only if:
  // 1. the wallet has a chainId
  // 2. the wallet has a switchChain method
  // 3. the wallet's chainId is not the same as the transaction's chainId
  // => switch tot he wanted chain
  if (
    options.wallet?.switchChain &&
    walletChainId &&
    walletChainId !== chainId
  ) {
    await options.wallet.switchChain(options.transaction.chain);
  }

  const serializableTx = await toSerializableTransaction({
    transaction: options.transaction,
    from: account.address,
  });
  const result = await account.sendTransaction(serializableTx);
  return { ...result, transaction: options.transaction };
}
