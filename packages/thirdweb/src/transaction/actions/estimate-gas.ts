import { formatTransactionRequest } from "viem";
import type { Wallet } from "../../wallets/interfaces/wallet.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import { extractError as parseEstimationError } from "../extract-error.js";
import type { Prettify } from "../../utils/type-utils.js";

type EstimateGasOptions = Prettify<
  {
    transaction: PreparedTransaction;
  } & (
    | {
        from?: string;
        wallet?: never;
      }
    | { from?: never; wallet?: Wallet }
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cache.get(options.transaction)!;
  }
  const promise = (async () => {
    const predefinedGas = await resolvePromisedValue(options.transaction.gas);
    // if we have a predefined gas value in the TX -> always use that
    if (predefinedGas) {
      return predefinedGas;
    }

    // if the wallet itself overrides the estimateGas function, use that
    if (options.wallet && options.wallet.estimateGas) {
      try {
        return await options.wallet.estimateGas(options.transaction);
      } catch (error) {
        throw await parseEstimationError({
          error,
          contract: options.transaction.__contract,
        });
      }
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
    try {
      return await eth_estimateGas(
        rpcRequest,
        formatTransactionRequest({
          to: toAddress,
          data: encodedData,
          from:
            // if the user has specified a from address, use that
            // otherwise use the wallet's account address
            // if the wallet is not provided, use undefined
            options.from ?? options.wallet?.getAccount()?.address ?? undefined,
        }),
      );
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
