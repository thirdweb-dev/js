import { getGasOverridesForTransaction } from "../../gas/fee-data.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { getAddress } from "../../utils/address.js";
import { isZkSyncChain } from "../../utils/any-evm/zksync/isZkSyncChain.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import type { SerializableTransaction } from "../serialize-transaction.js";
import { encode } from "./encode.js";
import { estimateGas } from "./estimate-gas.js";

export type ToSerializableTransactionOptions = {
  /**
   * The transaction to convert to a serializable transaction.
   */
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
  transaction: PreparedTransaction<any>;
  /**
   * The from address or account to use for gas estimation and authorization signing.
   */
  from?: string | Account;
};

/**
 * Converts a prepared transaction to a transaction with populated options.
 * @param options - The transaction and additional options for conversion
 * @returns A serializable transaction for inspection or submission to an account.
 *
 *  For easier transaction sending, {@see sendTransaction}
 * @example
 * ```ts
 * import { prepareTransaction, toSerializableTransaction } from "thirdweb";
 *
 * const transaction = await prepareTransaction({
 *   transaction: {
 *     to: "0x...",
 *     value: 100,
 *   },
 * });
 * const finalTx = await toSerializableTransaction({
 *   transaction,
 * });
 *
 * account.sendTransaction(finalTx);
 * ```
 * @transaction
 */
export async function toSerializableTransaction(
  options: ToSerializableTransactionOptions,
) {
  // zk chains require a different rpc method for gas estimation and gas fees
  const isZkSync = await isZkSyncChain(options.transaction.chain);
  if (isZkSync) {
    const { getZkGasFees } = await import(
      "./zksync/send-eip712-transaction.js"
    );
    const { gas, maxFeePerGas, maxPriorityFeePerGas } = await getZkGasFees({
      from:
        typeof options.from === "string" // Is this just an address?
          ? getAddress(options.from)
          : options.from !== undefined // Is this an account?
            ? getAddress(options.from.address)
            : undefined,
      transaction: options.transaction,
    });
    // passing these values here will avoid re-fetching them below
    options.transaction = {
      ...options.transaction,
      gas,
      maxFeePerGas,
      maxPriorityFeePerGas,
    };
  }

  const rpcRequest = getRpcClient(options.transaction);
  const chainId = options.transaction.chain.id;
  const from = options.from;
  let [
    data,
    nonce,
    gas,
    feeData,
    to,
    accessList,
    value,
    authorizationList,
    type,
  ] = await Promise.all([
    encode(options.transaction),
    (async () => {
      // if the user has specified a nonce, use that
      const resolvedNonce = await resolvePromisedValue(
        options.transaction.nonce,
      );
      if (resolvedNonce !== undefined) {
        return resolvedNonce;
      }

      return from // otherwise get the next nonce (import the method to do so)
        ? await import("../../rpc/actions/eth_getTransactionCount.js").then(
            ({ eth_getTransactionCount }) =>
              eth_getTransactionCount(rpcRequest, {
                address:
                  typeof from === "string"
                    ? getAddress(from)
                    : getAddress(from.address),
                blockTag: "pending",
              }),
          )
        : undefined;
    })(),
    // takes the same options as the sendTransaction function thankfully!
    estimateGas({
      ...options,
      from: options.from,
    }),
    getGasOverridesForTransaction(options.transaction),
    resolvePromisedValue(options.transaction.to),
    resolvePromisedValue(options.transaction.accessList),
    resolvePromisedValue(options.transaction.value),
    resolvePromisedValue(options.transaction.authorizationList),
    resolvePromisedValue(options.transaction.type),
  ]);

  const extraGas = await resolvePromisedValue(options.transaction.extraGas);
  if (extraGas) {
    gas += extraGas;
  }

  return {
    accessList,
    authorizationList,
    chainId,
    data,
    gas,
    nonce,
    to,
    type,
    value,
    ...feeData,
  } satisfies SerializableTransaction;
}
