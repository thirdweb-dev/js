import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "tokensOfOwner" function.
 */
export type TokensOfOwnerParams = {
  owner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "owner";
    type: "address";
  }>;
};

/**
 * Calls the "tokensOfOwner" function on the contract.
 * @param options - The options for the tokensOfOwner function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { tokensOfOwner } from "thirdweb/extensions/erc721";
 *
 * const result = await tokensOfOwner({
 *  owner: ...,
 * });
 *
 * ```
 */
export async function tokensOfOwner(
  options: BaseTransactionOptions<TokensOfOwnerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x8462151c",
      [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
    ],
    params: [options.owner],
  });
}
