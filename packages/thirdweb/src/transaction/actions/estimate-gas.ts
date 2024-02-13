import { encode } from "./encode.js";
import { formatTransactionRequest } from "viem/utils";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { eth_estimateGas, getRpcClient } from "../../rpc/index.js";
import { getGasOverridesForTransaction } from "../../gas/fee-data.js";
import type { PreparedTransaction } from "../transaction.js";

export type EstimateGasOptions = {
  transaction: PreparedTransaction;
  account?: Partial<Account> | undefined;
};

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
): Promise<bigint> {
  const rpcRequest = getRpcClient(options.transaction);

  const [gasOverrides, encodedData, toAddress] = await Promise.all([
    getGasOverridesForTransaction(options.transaction),
    encode(options.transaction),
    typeof options.transaction.to === "string"
      ? options.transaction.to
      : typeof options.transaction.to === "function"
        ? options.transaction.to()
        : undefined,
  ]);

  if (
    options.account &&
    options.account.wallet &&
    options.account.wallet.estimateGas
  ) {
    return options.account.wallet.estimateGas(options.transaction);
  }

  return eth_estimateGas(
    rpcRequest,
    formatTransactionRequest({
      to: toAddress,
      data: encodedData,
      ...gasOverrides,
      from: options.account?.address ?? undefined,
    }),
  );
}
