import type { TransactionSerializable } from "viem";
import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { getChainIdFromChain } from "../../chain/index.js";
import {
  resolvePossiblyAsyncValue,
  type PreparedTransaction,
} from "../transaction.js";

type SendTransactionOptions = {
  transaction: PreparedTransaction;
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
export async function sendTransaction(
  options: SendTransactionOptions,
): Promise<WaitForReceiptOptions> {
  if (!options.account.address) {
    throw new Error("not connected");
  }
  const { getRpcClient } = await import("../../rpc/index.js");
  const rpcRequest = getRpcClient(options.transaction);

  const [
    getGasOverridesForTransaction,
    encode,
    eth_getTransactionCount,
    estimateGas,
  ] = await Promise.all([
    import("../../gas/fee-data.js").then(
      (m) => m.getGasOverridesForTransaction,
    ),
    import("./encode.js").then((m) => m.encode),
    import("../../rpc/actions/eth_getTransactionCount.js").then(
      (m) => m.eth_getTransactionCount,
    ),
    import("./estimate-gas.js").then((m) => m.estimateGas),
  ]);

  const [gasOverrides, data, nonce, gas, to, accessList, value] =
    await Promise.all([
      getGasOverridesForTransaction(options.transaction),
      encode(options.transaction),
      // if the user has specified a nonce, use that
      options.transaction.nonce
        ? resolvePossiblyAsyncValue(options.transaction.nonce)
        : // otherwise get the next nonce
          eth_getTransactionCount(rpcRequest, {
            address: options.account.address,
            blockTag: "pending",
          }),
      // if user has specified a gas value, use that
      options.transaction.gas
        ? resolvePossiblyAsyncValue(options.transaction.gas)
        : // otherwise estimate the gas
          estimateGas({
            transaction: options.transaction,
            account: options.account,
          }),
      resolvePossiblyAsyncValue(options.transaction.to),
      resolvePossiblyAsyncValue(options.transaction.accessList),
      resolvePossiblyAsyncValue(options.transaction.value),
    ]);

  const result = await options.account.sendTransaction({
    to,
    chainId: Number(getChainIdFromChain(options.transaction.chain)),
    data,
    gas,
    ...gasOverrides,
    nonce,
    accessList,
    value,
  } satisfies TransactionSerializable);
  return { ...result, transaction: options.transaction };
}
