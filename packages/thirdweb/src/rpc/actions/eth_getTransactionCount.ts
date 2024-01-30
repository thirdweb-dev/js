import {
  type EIP1193RequestFn,
  type EIP1474Methods,
  numberToHex,
  hexToNumber,
  type GetTransactionCountParameters,
} from "viem";

/**
 * Retrieves the transaction count (nonce) for a given Ethereum address.
 * @param request - The EIP1193 request function.
 * @param params - The parameters for retrieving the transaction count.
 * @returns A promise that resolves to the transaction count as a number.
 * @example
 * ```ts
 * import { getRpcClient, eth_getTransactionCount } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chainId });
 * const transactionCount = await eth_getTransactionCount(rpcRequest, {
 *  address: "0x...",
 * });
 * ```
 */
export async function eth_getTransactionCount(
  request: EIP1193RequestFn<EIP1474Methods>,
  params: GetTransactionCountParameters,
): Promise<number> {
  const count = await request({
    method: "eth_getTransactionCount",
    params: [
      params.address,
      // makes sense to default to `pending` here, since we're asking for a transaction count (nonce)
      params.blockNumber
        ? numberToHex(params.blockNumber)
        : params.blockTag || "pending",
    ],
  });
  return hexToNumber(count);
}
