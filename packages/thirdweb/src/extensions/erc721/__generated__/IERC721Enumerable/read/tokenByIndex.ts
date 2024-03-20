import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "tokenByIndex" function.
 */
export type TokenByIndexParams = {
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_index" }>;
};

const METHOD = [
  "0x4f6ccce7",
  [
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
 * Calls the "tokenByIndex" function on the contract.
 * @param options - The options for the tokenByIndex function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { tokenByIndex } from "thirdweb/extensions/erc721";
 *
 * const result = await tokenByIndex({
 *  index: ...,
 * });
 *
 * ```
 */
export async function tokenByIndex(
  options: BaseTransactionOptions<TokenByIndexParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.index],
  });
}
