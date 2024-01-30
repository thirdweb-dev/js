import type { Transaction } from "../transaction.js";
import { getDefaultGasOverrides } from "../../gas/fee-data.js";
import { encode } from "./encode.js";
import { formatTransactionRequest } from "viem/utils";
import type { AbiFunction, Address } from "viem";
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
    getDefaultGasOverrides(
      options.transaction.contract.client,
      options.transaction.contract.chainId,
    ),
    encode(options.transaction),
  ]);

  // format the tx request
  const data = formatTransactionRequest({
    to: options.transaction.contract.address as Address,
    data: encodedData,
    ...gasOverrides,
    from: (options.wallet?.address ?? undefined) as Address,
  });

  if (options.wallet && options.wallet.estimateGas) {
    // TODO add this but fix types first
    // return options.wallet.estimateGas(data);
  }

  return eth_estimateGas(rpcRequest, data);
}
