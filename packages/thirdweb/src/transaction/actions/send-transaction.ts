import type { TransactionSerializable } from "viem";
import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { getChainIdFromChain } from "../../chain/index.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type { PreparedTransaction } from "../prepare-transaction.js";

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
    { encode },
    { eth_getTransactionCount },
    { estimateGas },
    { getGasOverridesForTransaction },
  ] = await Promise.all([
    import("./encode.js"),
    import("../../rpc/actions/eth_getTransactionCount.js"),
    import("./estimate-gas.js"),
    import("../../gas/fee-data.js"),
  ]);

  const [data, nonce, gas, feeData, to, accessList, value] = await Promise.all([
    encode(options.transaction),
    // if the user has specified a nonce, use that
    options.transaction.nonce
      ? resolvePromisedValue(options.transaction.nonce)
      : // otherwise get the next nonce
        eth_getTransactionCount(rpcRequest, {
          address: options.account.address,
          blockTag: "pending",
        }),
    // if user has specified a gas value, use that
    estimateGas({
      transaction: options.transaction,
      account: options.account,
    }),
    getGasOverridesForTransaction(options.transaction),
    resolvePromisedValue(options.transaction.to),
    resolvePromisedValue(options.transaction.accessList),
    resolvePromisedValue(options.transaction.value),
  ]);

  const result = await options.account.sendTransaction({
    to,
    chainId: Number(getChainIdFromChain(options.transaction.chain)),
    data,
    gas,
    nonce,
    accessList,
    value,
    ...feeData,
  } satisfies TransactionSerializable);
  return { ...result, transaction: options.transaction };
}
