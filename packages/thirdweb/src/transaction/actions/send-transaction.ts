import type { TransactionSerializable } from "viem";
import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";
import type { Account, Wallet } from "../../wallets/interfaces/wallet.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import type { Prettify } from "../../utils/type-utils.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { encode } from "./encode.js";
import { estimateGas } from "./estimate-gas.js";
import { getGasOverridesForTransaction } from "../../gas/fee-data.js";

export type SendTransactionOptions = Prettify<
  {
    transaction: PreparedTransaction;
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

  const rpcRequest = getRpcClient(options.transaction);
  const [data, nonce, gas, feeData, to, accessList, value] = await Promise.all([
    encode(options.transaction),
    // if the user has specified a nonce, use that
    options.transaction.nonce
      ? resolvePromisedValue(options.transaction.nonce)
      : // otherwise get the next nonce (import the method to do so)
        await import("../../rpc/actions/eth_getTransactionCount.js").then(
          ({ eth_getTransactionCount }) =>
            eth_getTransactionCount(rpcRequest, {
              address: account.address,
              blockTag: "pending",
            }),
        ),
    // takes the same options as the sendTransaction function thankfully!
    estimateGas(options),
    getGasOverridesForTransaction(options.transaction),
    resolvePromisedValue(options.transaction.to),
    resolvePromisedValue(options.transaction.accessList),
    resolvePromisedValue(options.transaction.value),
  ]);

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

  const result = await account.sendTransaction({
    to,
    chainId,
    data,
    gas,
    nonce,
    accessList,
    value,
    ...feeData,
  } satisfies TransactionSerializable);
  return { ...result, transaction: options.transaction };
}
