import type { AbiFunction } from "abitype";
import { getGasPrice } from "../gas/get-gas-price.js";
import { estimateGasCost } from "./actions/estimate-gas-cost.js";
import type { PreparedTransaction } from "./prepare-transaction.js";

/**
 * @internal
 */
export function isAbiFunction(item: unknown): item is AbiFunction {
  return !!(
    item &&
    typeof item === "object" &&
    "type" in item &&
    item.type === "function"
  );
}

export async function getTransactionGasCost(
  tx: PreparedTransaction,
  from?: string,
) {
  try {
    const gasCost = await estimateGasCost({
      from,
      transaction: tx,
    });

    const bufferCost = gasCost.wei / 10n;

    // Note: get tx.value AFTER estimateGasCost
    // add 10% extra gas cost to the estimate to ensure user buys enough to cover the tx cost
    return gasCost.wei + bufferCost;
  } catch {
    if (from) {
      // try again without passing from
      return await getTransactionGasCost(tx);
    }
    // fallback if both fail, use the tx value + 1M * gas price
    const gasPrice = await getGasPrice({
      chain: tx.chain,
      client: tx.client,
    });

    return 1_000_000n * gasPrice;
  }
}
