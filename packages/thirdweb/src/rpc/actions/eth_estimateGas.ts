import {
  hexToBigInt,
  type EIP1193RequestFn,
  type EIP1474Methods,
  type RpcTransactionRequest,
} from "viem";

/**
 * Estimates the gas required to execute a transaction on the Ethereum network.
 * @param request - The EIP1193 request function.
 * @param transactionRequest - The transaction request object.
 * @returns A promise that resolves to the estimated gas as a bigint.
 * @example
 * ```ts
 * import { getRpcClient, eth_estimateGas } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chain });
 * const gas = await eth_estimateGas(rpcRequest, {
 *  to: "0x...",
 *  ...
 * });
 * ```
 */
export async function eth_estimateGas(
  request: EIP1193RequestFn<EIP1474Methods>,
  transactionRequest: RpcTransactionRequest,
): Promise<bigint> {
  const estimateResult = await request({
    method: "eth_estimateGas",
    params: [transactionRequest],
  });
  return hexToBigInt(estimateResult);
}
