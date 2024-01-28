import { type EIP1193RequestFn, type EIP1474Methods, type Hash } from "viem";

export async function eth_sendRawTransaction(
  request: EIP1193RequestFn<EIP1474Methods>,
  signedTransaction: Hash,
) {
  return await request({
    method: "eth_sendRawTransaction",
    params: [signedTransaction],
  });
}
