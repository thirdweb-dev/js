import type { Transaction } from "../transaction.js";
import type { Abi, TransactionSerializable } from "viem";
import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";
import { resolveParams } from "./resolve-params.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { getChainIdFromChain } from "../../chain/index.js";

type SendTransactionOptions = {
  transaction: Transaction<any>;
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
): Promise<WaitForReceiptOptions<Abi>> {
  if (!options.account.address) {
    throw new Error("not connected");
  }
  const { getRpcClient } = await import("../../rpc/index.js");
  const rpcRequest = getRpcClient(options.transaction.contract);

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

  const [gasOverrides, data, nonce, gas, { overrides: dynamicOverrides }] =
    await Promise.all([
      getGasOverridesForTransaction(options.transaction),
      encode(options.transaction),
      // if the user has specified a nonce, use that
      options.transaction.nonce ??
        // otherwise get the next nonce
        eth_getTransactionCount(rpcRequest, {
          address: options.account.address,
          blockTag: "pending",
        }),
      // if user has specified a gas value, use that
      options.transaction.gas ??
        // otherwise estimate the gas
        estimateGas({
          transaction: options.transaction,
          account: options.account,
        }),
      resolveParams(options.transaction),
    ]);

  const result = await options.account.sendTransaction({
    to: options.transaction.contract.address,
    chainId: Number(getChainIdFromChain(options.transaction.contract.chain)),
    data,
    gas,
    ...gasOverrides,
    nonce,
    accessList: options.transaction.accessList,
    value: options.transaction.value ?? dynamicOverrides.value,
  } satisfies TransactionSerializable);
  return { ...result, contract: options.transaction.contract };
}
