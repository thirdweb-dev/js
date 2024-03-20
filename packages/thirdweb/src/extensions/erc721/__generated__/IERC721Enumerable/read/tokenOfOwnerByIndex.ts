import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "tokenOfOwnerByIndex" function.
 */
export type TokenOfOwnerByIndexParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "_owner" }>;
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_index" }>;
};

const METHOD = [
  "0x2f745c59",
  [
    {
      type: "address",
      name: "_owner",
    },
    {
      type: "uint256",
      name: "_index",
    },
  ],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "tokenOfOwnerByIndex" function on the contract.
 * @param options - The options for the tokenOfOwnerByIndex function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { tokenOfOwnerByIndex } from "thirdweb/extensions/erc721";
 *
 * const result = await tokenOfOwnerByIndex({
 *  owner: ...,
 *  index: ...,
 * });
 *
 * ```
 */
export async function tokenOfOwnerByIndex(
  options: BaseTransactionOptions<TokenOfOwnerByIndexParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.owner, options.index],
  });
}
