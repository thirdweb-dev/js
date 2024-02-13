import { formatTransactionRequest } from "viem/utils";
import type { Account } from "../../wallets/interfaces/wallet.js";
import {
  getGasOverridesForTransaction,
  type FeeDataParams,
} from "../../gas/fee-data.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import type { PreparedTransaction } from "../prepare-transaction.js";

export type EstimateGasOptions = {
  transaction: PreparedTransaction;
  account?: Partial<Account> | undefined;
};

export type EstimateGasResult = FeeDataParams & { gas: bigint };

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
  const [gasOverrides, predefinedGas] = await Promise.all([
    getGasOverridesForTransaction(options.transaction),
    resolvePromisedValue(options.transaction.gas),
  ]);
  // if we have a predefined gas value in the TX -> always use that
  if (predefinedGas) {
    return {
      ...gasOverrides,
      gas: predefinedGas,
    };
  }

  // load up encode function if we need it
  const { encode } = await import("./encode.js");
  const [encodedData, toAddress] = await Promise.all([
    encode(options.transaction),
    resolvePromisedValue(options.transaction.to),
  ]);

  // if the account itself overrides the estimateGas function, use that
  if (
    options.account &&
    options.account.wallet &&
    options.account.wallet.estimateGas
  ) {
    const gas = await options.account.wallet.estimateGas(options.transaction);
    return { ...gasOverrides, gas };
  }

  // load up the rpc client and the estimateGas function if we need it
  const [{ getRpcClient }, { eth_estimateGas }] = await Promise.all([
    import("../../rpc/rpc.js"),
    import("../../rpc/actions/eth_estimateGas.js"),
  ]);

  const rpcRequest = getRpcClient(options.transaction);
  const gas = await eth_estimateGas(
    rpcRequest,
    formatTransactionRequest({
      to: toAddress,
      data: encodedData,
      ...gasOverrides,
      from: options.account?.address ?? undefined,
    }),
  );
  return { ...gasOverrides, gas };
}
