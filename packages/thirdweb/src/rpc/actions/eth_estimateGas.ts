import {
  hexToBigInt,
  type EIP1193RequestFn,
  type EIP1474Methods,
  type RpcTransactionRequest,
} from "viem";

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
