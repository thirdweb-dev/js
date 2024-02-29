import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Represents the parameters for retrieving the total supply of a specific token.
 */
export type TotalSupplyParams = { tokenId: bigint };

/**
 * Retrieves the total supply of an ERC1155 token.
 * @param options - The transaction options.
 * @returns A promise that resolves to the total supply as a bigint.
 * @extension ERC1155
 * @example
 * ```ts
 * import { totalSupply } from "thirdweb/extensions/erc1155";
 * const totalSupply = await totalSupply({ contract, tokenId: 1n });
 * ```
 */
export function totalSupply(
  options: BaseTransactionOptions<TotalSupplyParams>,
): Promise<bigint> {
  return readContract({
    ...options,
    method: $run$(() =>
      prepareMethod("function totalSupply(uint256) returns (uint256)"),
    ),
    params: [options.tokenId],
  });
}
