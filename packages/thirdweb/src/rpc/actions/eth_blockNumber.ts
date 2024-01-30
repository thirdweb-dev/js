import { type EIP1193RequestFn, type EIP1474Methods, hexToBigInt } from "viem";

/**
 * Retrieves the current block number from the Ethereum blockchain.
 * @param request - The EIP1193 request function.
 * @returns A promise that resolves to the current block number as a bigint.
 * @example
 * ```ts
 * import { getRpcClient, eth_blockNumber } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chainId });
 * const blockNumber = await eth_blockNumber(rpcRequest);
 * ```
 */
export async function eth_blockNumber(
  request: EIP1193RequestFn<EIP1474Methods>,
): Promise<bigint> {
  const blockNumberHex = await request({
    method: "eth_blockNumber",
  });
  return hexToBigInt(blockNumberHex);
}
