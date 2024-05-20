import type { TransactionSerializable } from "viem";
import { getGasOverridesForTransaction } from "../../gas/fee-data.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import { encode } from "./encode.js";
import { estimateGas } from "./estimate-gas.js";

export type ToSerialiableTransactionOptions = {
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
  transaction: PreparedTransaction<any>;
  from?: string;
};

/**
 * @internal
 */
export async function toSerializableTransaction(
  options: ToSerialiableTransactionOptions,
) {
  const rpcRequest = getRpcClient(options.transaction);
  const chainId = options.transaction.chain.id;
  const from = options.from;
  let [data, nonce, gas, feeData, to, accessList, value] = await Promise.all([
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
                address: from,
                blockTag: "pending",
              }),
          )
        : undefined;
    })(),
    // takes the same options as the sendTransaction function thankfully!
    estimateGas(options),
    getGasOverridesForTransaction(options.transaction),
    resolvePromisedValue(options.transaction.to),
    resolvePromisedValue(options.transaction.accessList),
    resolvePromisedValue(options.transaction.value),
  ]);

  const extraGas = await resolvePromisedValue(options.transaction.extraGas);
  if (extraGas) {
    gas += extraGas;
  }

  return {
    to,
    chainId,
    data,
    gas,
    nonce,
    accessList,
    value,
    ...feeData,
  } satisfies TransactionSerializable;
}
