import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "tokenByIndex" function.
 */
export type TokenByIndexParams = {
  index: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_index";
    type: "uint256";
  }>;
};

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
    method: [
      "0x4f6ccce7",
      [
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.index],
  });
}
