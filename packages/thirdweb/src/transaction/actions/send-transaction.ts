import type { Transaction } from "../transaction.js";
import type { Abi, AbiFunction, TransactionSerializable } from "viem";
import type { Wallet } from "../../wallets/interfaces/wallet.js";
import type { WaitForReceiptOptions } from "./wait-for-tx-receipt.js";
import { getChainIdFromChain } from "../../chain/index.js";
import { resolveParams } from "./resolve-params.js";

type SendTransactionOptions<
  abiFn extends AbiFunction,
  wallet extends Wallet,
> = {
  transaction: Transaction<abiFn>;
  wallet: wallet;
};

/**
 * Sends a transaction using the provided wallet.
 * @param options - The options for sending the transaction.
 * @returns A promise that resolves to the transaction hash.
 * @throws An error if the wallet is not connected.
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * const transactionHash = await sendTransaction({
 *  wallet,
 *  transaction
 * });
 * ```
 */
export async function sendTransaction<
  abiFn extends AbiFunction,
  wallet extends Wallet,
>(
  options: SendTransactionOptions<abiFn, wallet>,
): Promise<WaitForReceiptOptions<Abi>> {
  if (!options.wallet.address) {
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
          address: options.wallet.address,
          blockTag: "pending",
        }),
      // if user has specified a gas value, use that
      options.transaction.gas ??
        // otherwise estimate the gas
        estimateGas({
          transaction: options.transaction,
          wallet: options.wallet,
        }),
      resolveParams(options.transaction),
    ]);

  const result = await options.wallet.sendTransaction({
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
