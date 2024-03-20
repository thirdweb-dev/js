import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "convertToAssets" function.
 */
export type ConvertToAssetsParams = {
  shares: AbiParameterToPrimitiveType<{
    name: "shares";
    type: "uint256";
    internalType: "uint256";
  }>;
};

const METHOD = [
  "0x07a2d13a",
  [
    {
      name: "shares",
      type: "uint256",
      internalType: "uint256",
    },
  ],
  [
    {
      name: "assets",
      type: "uint256",
      internalType: "uint256",
    },
  ],
] as const;

/**
 * Calls the "convertToAssets" function on the contract.
 * @param options - The options for the convertToAssets function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { convertToAssets } from "thirdweb/extensions/erc4626";
 *
 * const result = await convertToAssets({
 *  shares: ...,
 * });
 *
 * ```
 */
export async function convertToAssets(
  options: BaseTransactionOptions<ConvertToAssetsParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.shares],
  });
}
