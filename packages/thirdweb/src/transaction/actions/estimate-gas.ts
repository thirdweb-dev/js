import { formatTransactionRequest } from "viem/utils";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type { PreparedTransaction } from "../prepare-transaction.js";

export type EstimateGasOptions = {
  transaction: PreparedTransaction;
  account?: Partial<Account> | undefined;
};

export type EstimateGasResult = bigint;

const cache = new WeakMap<PreparedTransaction, Promise<EstimateGasResult>>();

/**
 * Estimates the gas required to execute a transaction.
 * @param options - The options for estimating gas.
 * @returns A promise that resolves to the estimated gas as a bigint.
 * @transaction
 * @example
 * ```ts
 * import { estimateGas } from "thirdweb";
 * const gas = await estimateGas({
 *  transaction,
 * });
 * ```
 */
export async function estimateGas(
  options: EstimateGasOptions,
): Promise<EstimateGasResult> {
  if (cache.has(options.transaction)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cache.get(options.transaction)!;
  }
  const promise = (async () => {
    const predefinedGas = await resolvePromisedValue(options.transaction.gas);
    // if we have a predefined gas value in the TX -> always use that
    if (predefinedGas) {
      return predefinedGas;
    }

    // if the account itself overrides the estimateGas function, use that
    if (options.account && options.account.estimateGas) {
      return await options.account.estimateGas(options.transaction);
    }

    // load up encode function if we need it
    const { encode } = await import("./encode.js");
    const [encodedData, toAddress] = await Promise.all([
      encode(options.transaction),
      resolvePromisedValue(options.transaction.to),
    ]);

    // load up the rpc client and the estimateGas function if we need it
    const [{ getRpcClient }, { eth_estimateGas }] = await Promise.all([
      import("../../rpc/rpc.js"),
      import("../../rpc/actions/eth_estimateGas.js"),
    ]);

    const rpcRequest = getRpcClient(options.transaction);
    return await eth_estimateGas(
      rpcRequest,
      formatTransactionRequest({
        to: toAddress,
        data: encodedData,
        from: options.account?.address ?? undefined,
      }),
    );
  })();
  cache.set(options.transaction, promise);
  return promise;
}
