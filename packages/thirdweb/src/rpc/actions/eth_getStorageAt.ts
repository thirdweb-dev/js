import type { BlockTag, EIP1193RequestFn, EIP1474Methods, Hex } from "viem";

type GetStorageAtParams = {
  address: string;
  position: Hex;
  blockTag?: BlockTag;
};

/**
 * Retrieves the value stored at a specific position in the storage of a contract.
 * @param request - The EIP1193 request function.
 * @param params - The parameters for the eth_getStorageAt method.
 * @returns A promise that resolves to the value stored at the specified position.
 * @rpc
 * @example
 * ```ts
 * import { getRpcClient, eth_getStorageAt } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chain });
 * const storageValue = await eth_getStorageAt(rpcRequest, {
 * address: "0x...",
 *  position: 0n,
 * });
 * ```
 */
export async function eth_getStorageAt(
  request: EIP1193RequestFn<EIP1474Methods>,
  params: GetStorageAtParams,
): Promise<Hex> {
  return await request({
    method: "eth_getStorageAt",
    params: [params.address, params.position, params.blockTag ?? "latest"],
  });
}
