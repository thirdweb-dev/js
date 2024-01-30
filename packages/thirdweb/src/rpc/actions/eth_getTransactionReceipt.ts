import {
  formatTransactionReceipt,
  type EIP1193RequestFn,
  type GetTransactionReceiptParameters,
  type EIP1474Methods,
  type TransactionReceipt,
} from "viem";

/**
 * Retrieves the transaction receipt for a given transaction hash.
 * Throws an error if the receipt is not found.
 * @param request - The EIP1193 request function.
 * @param params - The parameters for retrieving the transaction receipt.
 * @returns A promise that resolves to the transaction receipt.
 * @throws An error if the transaction receipt is not found.
 * @example
 * ```ts
 * import { getRpcClient, eth_getTransactionReceipt } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chainId });
 * const transactionReceipt = await eth_getTransactionReceipt(rpcRequest, {
 *  hash: "0x...",
 * });
 * ```
 */
export async function eth_getTransactionReceipt(
  request: EIP1193RequestFn<EIP1474Methods>,
  params: GetTransactionReceiptParameters,
): Promise<TransactionReceipt> {
  const receipt = await request({
    method: "eth_getTransactionReceipt",
    params: [params.hash],
  });

  if (!receipt) {
    throw new Error("Transaction receipt not found.");
  }

  return formatTransactionReceipt(receipt);
}
