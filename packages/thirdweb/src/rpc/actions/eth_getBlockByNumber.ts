import {
  formatBlock,
  type BlockTag,
  type EIP1193RequestFn,
  type EIP1474Methods,
  numberToHex,
  type GetBlockReturnType,
} from "viem";

type GetBlockParameters<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = "latest",
> = {
  /** Whether or not to include transaction data in the response. */
  includeTransactions?: TIncludeTransactions;
} & (
  | {
      /** The block number. */
      blockNumber?: bigint;
      blockTag?: never;
    }
  | {
      blockNumber?: never;
      /**
       * The block tag.
       * default: 'latest'
       */
      blockTag?: TBlockTag | BlockTag;
    }
);

export async function eth_getBlockByNumber<
  TIncludeTransactions extends boolean = false,
  TBlockTag extends BlockTag = "latest",
>(
  request: EIP1193RequestFn<EIP1474Methods>,
  {
    blockNumber,
    blockTag: blockTag_,
    includeTransactions: includeTransactions_,
  }: GetBlockParameters<TIncludeTransactions, TBlockTag>,
): Promise<GetBlockReturnType<undefined, TIncludeTransactions, TBlockTag>> {
  const blockTag = blockTag_ ?? "latest";
  const includeTransactions = includeTransactions_ ?? false;
  const blockNumberHex =
    blockNumber !== undefined ? numberToHex(blockNumber) : undefined;

  const block = await request({
    method: "eth_getBlockByNumber",
    params: [blockNumberHex || blockTag, includeTransactions],
  });
  if (!block) {
    throw new Error("Block not found");
  }
  return formatBlock(block) as GetBlockReturnType<
    undefined,
    TIncludeTransactions,
    TBlockTag
  >;
}
