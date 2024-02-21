import type {
  EIP1193RequestFn,
  EIP1474Methods,
  GetTransactionCountParameters,
} from "viem";
import { hexToNumber, numberToHex } from "../../utils/hex.js";

/**
 * Retrieves the transaction count (nonce) for a given Ethereum address.
 * @param request - The EIP1193 request function.
 * @param params - The parameters for retrieving the transaction count.
 * @returns A promise that resolves to the transaction count as a number.
 * @rpc
 * @example
 * ```ts
 * import { getRpcClient, eth_getTransactionCount } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chain });
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
