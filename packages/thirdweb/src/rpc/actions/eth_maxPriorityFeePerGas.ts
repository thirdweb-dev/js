import { hexToBigInt, type EIP1193RequestFn, type EIP1474Methods } from "viem";

export async function eth_maxPriorityFeePerGas(
  request: EIP1193RequestFn<EIP1474Methods>,
): Promise<bigint> {
  const result = await request({
    method: "eth_maxPriorityFeePerGas",
  });
  return hexToBigInt(result);
}
