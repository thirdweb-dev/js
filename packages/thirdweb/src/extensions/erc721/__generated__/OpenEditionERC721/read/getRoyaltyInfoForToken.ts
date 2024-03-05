import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getRoyaltyInfoForToken" function.
 */
export type GetRoyaltyInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_tokenId";
    type: "uint256";
  }>;
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
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
    ],
    params: [options.tokenId],
  });
}
