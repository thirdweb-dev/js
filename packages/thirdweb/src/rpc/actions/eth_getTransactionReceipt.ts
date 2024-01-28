import {
  formatTransactionReceipt,
  type EIP1193RequestFn,
  type GetTransactionReceiptParameters,
  type EIP1474Methods,
  type TransactionReceipt,
} from "viem";

export async function eth_getTransactionReceipt(
  request: EIP1193RequestFn<EIP1474Methods>,
  { hash }: GetTransactionReceiptParameters,
): Promise<TransactionReceipt> {
  const receipt = await request({
    method: "eth_getTransactionReceipt",
    params: [hash],
  });

  if (!receipt) {
    throw new Error("Transaction receipt not found.");
  }

  return formatTransactionReceipt(receipt);
}
