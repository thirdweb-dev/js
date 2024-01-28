import { type EIP1193RequestFn, type EIP1474Methods, hexToBigInt } from "viem";

export async function eth_blockNumber(
  request: EIP1193RequestFn<EIP1474Methods>,
): Promise<bigint> {
  const blockNumberHex = await request({
    method: "eth_blockNumber",
  });
  return hexToBigInt(blockNumberHex);
}
