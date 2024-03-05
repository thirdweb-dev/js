import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "tokenOfOwnerByIndex" function.
 */
export type TokenOfOwnerByIndexParams = {
  owner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_owner";
    type: "address";
  }>;
  index: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_index";
    type: "uint256";
  }>;
};

/**
 * Calls the tokenOfOwnerByIndex function on the contract.
 * @param options - The options for the tokenOfOwnerByIndex function.
 * @returns The parsed result of the function call.
 * @extension IERC721ENUMERABLE
 * @example
 * ```
 * import { tokenOfOwnerByIndex } from "thirdweb/extensions/IERC721Enumerable";
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
    method: [
      "0x2f745c59",
      [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
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
    params: [options.owner, options.index],
  });
}
