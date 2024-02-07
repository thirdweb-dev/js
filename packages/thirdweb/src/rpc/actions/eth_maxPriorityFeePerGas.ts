import { hexToBigInt, type EIP1193RequestFn, type EIP1474Methods } from "viem";

/**
 * Retrieves the maximum priority fee per gas from the Ethereum network.
 * @param request - The EIP1193 request function.
 * @returns A promise that resolves to a bigint representing the maximum priority fee per gas.
 * @rpc
 * @example
 * ```ts
 * import { getRpcClient, eth_maxPriorityFeePerGas } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chain });
 * const maxPriorityFeePerGas = await eth_maxPriorityFeePerGas(rpcRequest);
 * ```
 */
export async function eth_maxPriorityFeePerGas(
  request: EIP1193RequestFn<EIP1474Methods>,
): Promise<bigint> {
  const result = await request({
    method: "eth_maxPriorityFeePerGas",
  });
  return hexToBigInt(result);
}
