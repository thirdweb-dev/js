import {
  type EIP1193RequestFn,
  type EIP1474Methods,
  numberToHex,
  hexToNumber,
  type GetTransactionCountParameters,
} from "viem";

export async function eth_getTransactionCount(
  request: EIP1193RequestFn<EIP1474Methods>,
  { address, blockTag = "latest", blockNumber }: GetTransactionCountParameters,
): Promise<number> {
  const count = await request({
    method: "eth_getTransactionCount",
    params: [address, blockNumber ? numberToHex(blockNumber) : blockTag],
  });
  return hexToNumber(count);
}
