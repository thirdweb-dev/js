import { formatTransactionRequest } from "viem";
import { roundUpGas } from "../../gas/op-gas-fee-reducer.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { extractError as parseEstimationError } from "../extract-error.js";
import type { PreparedTransaction } from "../prepare-transaction.js";

export type EstimateGasOptions = Prettify<
  {
    transaction: PreparedTransaction;
  } & (
    | {
        account: Account;
        from?: never;
      }
    | {
        account?: never;
        from?: string;
      }
  )
>;

export type EstimateGasResult = bigint;

const cache = new WeakMap<PreparedTransaction, Promise<EstimateGasResult>>();

/**
 * Estimates the gas required to execute a transaction. The gas is returned as a `bigint` and in gwei units.
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
    // biome-ignore lint/style/noNonNullAssertion: the `has` above ensures that this will always be set
    return cache.get(options.transaction)!;
  }
  const { account } = options;
  const promise = (async () => {
    const predefinedGas = await resolvePromisedValue(options.transaction.gas);
    // if we have a predefined gas value in the TX -> always use that
    if (predefinedGas) {
      return predefinedGas;
    }

    // if the wallet itself overrides the estimateGas function, use that
    if (account?.estimateGas) {
      try {
        let gas = await account.estimateGas(options.transaction);
        if (options.transaction.chain.experimental?.increaseZeroByteCount) {
          gas = roundUpGas(gas);
        }
        return gas;
      } catch (error) {
        throw await parseEstimationError({
          error,
          contract: options.transaction.__contract,
        });
      }
    }

    // load up encode function if we need it
    const { encode } = await import("./encode.js");
    const [encodedData, toAddress, value] = await Promise.all([
      encode(options.transaction),
      resolvePromisedValue(options.transaction.to),
      resolvePromisedValue(options.transaction.value),
    ]);

    // load up the rpc client and the estimateGas function if we need it
    const [{ getRpcClient }, { eth_estimateGas }] = await Promise.all([
      import("../../rpc/rpc.js"),
      import("../../rpc/actions/eth_estimateGas.js"),
    ]);

    const rpcRequest = getRpcClient(options.transaction);
    // from is:
    // 1. the user specified from address
    // 2. the passed in account address
    // 3. the passed in wallet's account address
    const from = options.from ?? options.account?.address ?? undefined;
    try {
      let gas = await eth_estimateGas(
        rpcRequest,
        formatTransactionRequest({
          to: toAddress,
          data: encodedData,
          from,
          value,
        }),
      );
      if (options.transaction.chain.experimental?.increaseZeroByteCount) {
        gas = roundUpGas(gas);
      }
      return gas;
    } catch (error) {
      throw await parseEstimationError({
        error,
        contract: options.transaction.__contract,
      });
    }
  })();
  cache.set(options.transaction, promise);
  return promise;
}
