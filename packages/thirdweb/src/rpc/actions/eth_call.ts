import {
  type BlockTag,
  numberToHex,
  type EIP1193RequestFn,
  type EIP1474Methods,
  type RpcTransactionRequest,
  type Hex,
} from "viem";

export async function eth_call(
  request: EIP1193RequestFn<EIP1474Methods>,
  params: Partial<RpcTransactionRequest> & {
    blockNumber?: bigint | number;
    blockTag?: BlockTag;
  },
): Promise<Hex> {
  const { blockNumber, blockTag, ...txRequest } = params;
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
  // TODO: per RPC spec omitting the block is allowed, however for some reason our RPCs don't like it, so we default to "latest" here
  const block = blockNumberHex || blockTag || "latest";

  return await request({
    method: "eth_call",
    params: block
      ? [txRequest as Partial<RpcTransactionRequest>, block]
      : [txRequest as Partial<RpcTransactionRequest>],
  });
}
