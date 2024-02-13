import type { Transaction } from "../transaction.js";
import { encode } from "./encode.js";
import { formatTransactionRequest } from "viem/utils";
import type { AbiFunction } from "viem";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { eth_estimateGas, getRpcClient } from "../../rpc/index.js";
import { getGasOverridesForTransaction } from "../../gas/fee-data.js";

export type EstimateGasOptions<abiFn extends AbiFunction> = {
  transaction: Transaction<abiFn>;
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
export async function estimateGas<abiFn extends AbiFunction>(
  options: EstimateGasOptions<abiFn>,
): Promise<bigint> {
  const rpcRequest = getRpcClient(options.transaction.contract);

  if (options.account && options.account.estimateGas) {
    return options.account.estimateGas(options.transaction);
  }

  const [gasOverrides, encodedData] = await Promise.all([
    getGasOverridesForTransaction(options.transaction),
    encode(options.transaction),
  ]);

  return eth_estimateGas(
    rpcRequest,
    formatTransactionRequest({
      to: options.transaction.contract.address,
      data: encodedData,
      ...gasOverrides,
      from: options.account?.address ?? undefined,
    }),
  );
}
