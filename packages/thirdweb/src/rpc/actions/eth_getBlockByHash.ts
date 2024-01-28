import {
  formatBlock,
  type EIP1193RequestFn,
  type EIP1474Methods,
  type GetBlockReturnType,
  type Hash,
} from "viem";

type GetBlockByHashParams<TIncludeTransactions extends boolean = false> = {
  /** Whether or not to include transaction data in the response. */
  includeTransactions?: TIncludeTransactions;
} & {
  /** Hash of the block. */
  blockHash: Hash;
};

export async function eth_getBlockByHash<
  TIncludeTransactions extends boolean = false,
>(
  request: EIP1193RequestFn<EIP1474Methods>,
  {
    blockHash,
    includeTransactions: includeTransactions_,
  }: GetBlockByHashParams<TIncludeTransactions>,
): Promise<GetBlockReturnType<undefined, TIncludeTransactions>> {
  const includeTransactions = includeTransactions_ ?? false;

  const block = await request({
    method: "eth_getBlockByHash",
    params: [blockHash, includeTransactions],
  });
  if (!block) {
    throw new Error("Block not found");
  }
  return formatBlock(block) as GetBlockReturnType<
    undefined,
    TIncludeTransactions
  >;
}
