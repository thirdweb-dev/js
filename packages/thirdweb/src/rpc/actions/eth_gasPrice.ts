import { hexToBigInt, type EIP1193RequestFn, type EIP1474Methods } from "viem";

export async function eth_gasPrice(
  request: EIP1193RequestFn<EIP1474Methods>,
): Promise<bigint> {
  const result = await request({
    method: "eth_gasPrice",
  });
  return hexToBigInt(result);
}
