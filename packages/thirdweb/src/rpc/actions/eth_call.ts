import {
  type BlockTag,
  numberToHex,
  type EIP1193RequestFn,
  type EIP1474Methods,
  type RpcTransactionRequest,
  type Hex,
} from "viem";

/**
 * Executes a call or a transaction on the Ethereum network.
 * @param request - The EIP1193 request function.
 * @param params - The parameters for the call or transaction.
 * @returns A promise that resolves to the result of the call or transaction.
 * @rpc
 * @example
 * ```ts
 * import { getRpcClient, eth_call } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chain });
 * const result = await eth_call(rpcRequest, {
 *  to: "0x...",
 *  ...
 * });
 * ```
 */
export async function eth_call(
  request: EIP1193RequestFn<EIP1474Methods>,
  params: Partial<RpcTransactionRequest> & {
    blockNumber?: bigint | number;
    blockTag?: BlockTag;
  },
): Promise<Hex> {
  const { blockNumber, blockTag, ...txRequest } = params;
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
  // default to "latest" if no block is provided
  const block = blockNumberHex || blockTag || "latest";

  return await request({
    method: "eth_call",
    params: [txRequest as Partial<RpcTransactionRequest>, block],
  });
}
