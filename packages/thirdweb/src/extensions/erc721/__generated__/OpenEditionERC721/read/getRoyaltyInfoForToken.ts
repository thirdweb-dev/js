import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getRoyaltyInfoForToken" function.
 */
export type GetRoyaltyInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
};

/**
 * Calls the "getRoyaltyInfoForToken" function on the contract.
 * @param options - The options for the getRoyaltyInfoForToken function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { getRoyaltyInfoForToken } from "thirdweb/extensions/erc721";
 *
 * const result = await getRoyaltyInfoForToken({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getRoyaltyInfoForToken(
  options: BaseTransactionOptions<GetRoyaltyInfoForTokenParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x4cc157df",
      [
        {
          type: "uint256",
          name: "_tokenId",
        },
      ],
      [
        {
          type: "address",
        },
        {
          type: "uint16",
        },
      ],
    ],
    params: [options.tokenId],
  });
}
