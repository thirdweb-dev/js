import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "tokenURI" function.
 */
export type TokenURIParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
};

/**
 * Calls the "tokenURI" function on the contract.
 * @param options - The options for the tokenURI function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { tokenURI } from "thirdweb/extensions/erc721";
 *
 * const result = await tokenURI({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function tokenURI(
  options: BaseTransactionOptions<TokenURIParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc87b56dd",
      [
        {
          type: "uint256",
          name: "_tokenId",
        },
      ],
      [
        {
          type: "string",
        },
      ],
    ],
    params: [options.tokenId],
  });
}
