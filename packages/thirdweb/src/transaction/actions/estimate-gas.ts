import type { Transaction } from "../transaction.js";
import { getGasOverridesForTransaction } from "../../gas/fee-data.js";
import { encode } from "./encode.js";
import { formatTransactionRequest } from "viem/utils";
import type { AbiFunction } from "viem";
import { getRpcClient, eth_estimateGas } from "../../rpc/index.js";
import type { Wallet } from "../../wallets/index.js";

export type EstimateGasOptions<abiFn extends AbiFunction> = {
  transaction: Transaction<abiFn>;
  wallet?: Partial<Wallet> | undefined;
};

/**
 * Estimates the gas required to execute a transaction.
 * @param options - The options for estimating gas.
 * @returns A promise that resolves to the estimated gas as a bigint.
 * @example
 * ```ts
 * import { estimateGas } from "thirdweb";
 * const gas = await estimateGas(tx);
 * ```
 */
export async function estimateGas<abiFn extends AbiFunction>(
  options: EstimateGasOptions<abiFn>,
): Promise<bigint> {
  const rpcRequest = getRpcClient(options.transaction.contract);

  const [gasOverrides, encodedData] = await Promise.all([
    getGasOverridesForTransaction(options.transaction),
    encode(options.transaction),
  ]);

  if (options.wallet && options.wallet.estimateGas) {
    return options.wallet.estimateGas(options.transaction);
  }

  return eth_estimateGas(
    rpcRequest,
    formatTransactionRequest({
      to: options.transaction.contract.address,
      data: encodedData,
      ...gasOverrides,
      from: options.wallet?.address ?? undefined,
    }),
  );
}
