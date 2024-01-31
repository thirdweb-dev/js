import type { EIP1193RequestFn, EIP1474Methods, Hex } from "viem";

/**
 * Sends a raw transaction to the Ethereum network.
 * @param request - The EIP1193 request function.
 * @param signedTransaction - The signed transaction in hex format.
 * @returns A promise that resolves to the transaction hash.
 * @example
 * ```ts
 * import { getRpcClient, eth_sendRawTransaction } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chain });
 * const transactionHash = await eth_sendRawTransaction(rpcRequest, "0x...");
 * ```
 */
export async function eth_sendRawTransaction(
  request: EIP1193RequestFn<EIP1474Methods>,
  signedTransaction: Hex,
) {
  return await request({
    method: "eth_sendRawTransaction",
    params: [signedTransaction],
  });
}
