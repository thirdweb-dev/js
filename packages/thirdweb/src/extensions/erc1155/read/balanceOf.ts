import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * Represents the parameters for the balanceOf function.
 */
export type BalanceOfParams = {
  address: string;
  tokenId: bigint;
};

/**
 * Retrieves the next token ID to be minted in an ERC1155 contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the next token ID as a bigint.
 * @extension ERC1155
 * @example
 * ```ts
 * import { nextTokenIdToMint } from "thirdweb/extensions/erc1155";
 * const nextTokenId = await nextTokenIdToMint({ contract, address: "0x...", tokenId: 1n });
 * ```
 */
export function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>,
): Promise<bigint> {
  return readContract({
    ...options,
    method: [
  "0x00fdd58e",
  [
    {
      "type": "address"
    },
    {
      "type": "uint256"
    }
  ],
  [
    {
      "type": "uint256"
    }
  ]
],
    params: [options.address, options.tokenId],
  });
}
