import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "convertToShares" function.
 */
export type ConvertToSharesParams = {
  assets: AbiParameterToPrimitiveType<{
    name: "assets";
    type: "uint256";
    internalType: "uint256";
  }>;
};

/**
 * Calls the "convertToShares" function on the contract.
 * @param options - The options for the convertToShares function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { convertToShares } from "thirdweb/extensions/erc4626";
 *
 * const result = await convertToShares({
 *  assets: ...,
 * });
 *
 * ```
 */
export async function convertToShares(
  options: BaseTransactionOptions<ConvertToSharesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc6e6f592",
      [
        {
          name: "assets",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      [
        {
          name: "shares",
          type: "uint256",
          internalType: "uint256",
        },
      ],
    ],
    params: [options.assets],
  });
}
