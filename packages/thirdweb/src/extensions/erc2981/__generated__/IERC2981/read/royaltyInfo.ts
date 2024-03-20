import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "royaltyInfo" function.
 */
export type RoyaltyInfoParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  salePrice: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "salePrice";
  }>;
};

/**
 * Calls the "royaltyInfo" function on the contract.
 * @param options - The options for the royaltyInfo function.
 * @returns The parsed result of the function call.
 * @extension ERC2981
 * @example
 * ```
 * import { royaltyInfo } from "thirdweb/extensions/erc2981";
 *
 * const result = await royaltyInfo({
 *  tokenId: ...,
 *  salePrice: ...,
 * });
 *
 * ```
 */
export async function royaltyInfo(
  options: BaseTransactionOptions<RoyaltyInfoParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x2a55205a",
      [
        {
          type: "uint256",
          name: "tokenId",
        },
        {
          type: "uint256",
          name: "salePrice",
        },
      ],
      [
        {
          type: "address",
          name: "receiver",
        },
        {
          type: "uint256",
          name: "royaltyAmount",
        },
      ],
    ],
    params: [options.tokenId, options.salePrice],
  });
}
