import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { eth_gasPrice } from "../rpc/actions/eth_gasPrice.js";
import { getRpcClient } from "../rpc/rpc.js";

export type GetGasPriceOptions = {
  client: ThirdwebClient;
  chain: Chain;
  percentMultiplier?: number;
};

/**
 * Retrieves the gas price for a transaction on a specific chain.
 * @param client - The Thirdweb client.
 * @param chain - The ID of the chain.
 * @returns A promise that resolves to the gas price as a bigint.
 * @example
 * ```ts
 * import { getGasPrice } from "thirdweb";
 *
 * const gasPrice = await getGasPrice({ client, chain });
 * ```
 */
export async function getGasPrice(
  options: GetGasPriceOptions,
): Promise<bigint> {
  const { client, chain, percentMultiplier } = options;
  const rpcClient = getRpcClient({ client, chain });
  const gasPrice_ = await eth_gasPrice(rpcClient);
  const extraTip = percentMultiplier
    ? (gasPrice_ / BigInt(100)) * BigInt(percentMultiplier)
    : 0n;
  const txGasPrice = gasPrice_ + extraTip;
  return txGasPrice;
}
