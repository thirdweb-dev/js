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

/**
 * Retrieves a block by its hash.
 * @param request - The EIP1193 request function.
 * @param params - The parameters for the block retrieval.
 * @returns A promise that resolves to the retrieved block.
 * @throws An error if the block is not found.
 * @example
 * ```ts
 * import { getRpcClient, eth_getBlockByHash } from "thirdweb/rpc";
 * const rpcRequest = getRpcClient({ client, chainId });
 * const block = await eth_getBlockByHash(rpcRequest, {
 * blockHash: "0x...",
 * includeTransactions: true,
 * });
 * ```
 */
export async function eth_getBlockByHash<
  TIncludeTransactions extends boolean = false,
>(
  request: EIP1193RequestFn<EIP1474Methods>,
  params: GetBlockByHashParams<TIncludeTransactions>,
): Promise<GetBlockReturnType<undefined, TIncludeTransactions>> {
  const includeTransactions = params.includeTransactions ?? false;

  const block = await request({
    method: "eth_getBlockByHash",
    params: [params.blockHash, includeTransactions],
  });
  if (!block) {
    throw new Error("Block not found");
  }
  return formatBlock(block) as GetBlockReturnType<
    undefined,
    TIncludeTransactions
  >;
}
