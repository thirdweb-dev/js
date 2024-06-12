import { isOpStackChain } from "../../chains/constants.js";
import { getGasPrice } from "../../gas/get-gas-price.js";
import { resolvePromisedValue } from "../../utils/promise/resolve-promised-value.js";
import { toEther } from "../../utils/units.js";
import { type EstimateGasOptions, estimateGas } from "./estimate-gas.js";

export type EstimateGasCostResult = {
  /**
   * The estimated gas cost in ether.
   */
  ether: string;
  /**
   * The estimated gas cost in wei.
   */
  wei: bigint;
};

/**
 * Estimate the gas cost of a transaction in ether and wei.
 * @example
 * ```ts
 * import { estimateGasCost } from "thirdweb";
 *
 * const gasCost = await estimateGasCost({ transaction });
 * ```
 */
export async function estimateGasCost(
  options: EstimateGasOptions,
): Promise<EstimateGasCostResult> {
  const { transaction } = options;
  const from = options.from ?? options.account?.address ?? undefined;
  const gasLimit =
    (await resolvePromisedValue(transaction.gas)) ||
    (await estimateGas({ transaction, from }));
  const gasPrice = await getGasPrice({
    client: transaction.client,
    chain: transaction.chain,
  });
  let l1Fee: bigint;
  if (isOpStackChain(transaction.chain)) {
    const { estimateL1Fee } = await import("../../gas/estimate-l1-fee.js");
    l1Fee = await estimateL1Fee({
      transaction,
    });
  } else {
    l1Fee = 0n;
  }
  const wei = gasLimit * gasPrice + l1Fee;
  return {
    ether: toEther(wei),
    wei,
  };
}
