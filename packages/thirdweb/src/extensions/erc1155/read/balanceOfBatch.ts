import { type TxOpts } from "../../../transaction/transaction.js";
import { readContract } from "../../../transaction/actions/read.js";

export type BalanceOfBatchParams = {
  owners: readonly string[];
  tokenIds: readonly bigint[];
};

/**
 * Retrieves the next token ID to be minted in an ERC1155 contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the next token ID as a bigint.
 * @example
 * ```ts
 * import { nextTokenIdToMint } from "thirdweb/extensions/erc1155";
 * const nextTokenId = await nextTokenIdToMint({ contract });
 * ```
 */
export function balanceOfBatch(
  options: TxOpts<BalanceOfBatchParams>,
): Promise<readonly bigint[]> {
  return readContract({
    ...options,
    method:
      "function balanceOfBatch(owners address[], tokenIds uint256[]) view returns (uint256[])",
    params: [options.owners, options.tokenIds],
  });
}
