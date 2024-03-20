import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "previewMint" function.
 */
export type PreviewMintParams = {
  shares: AbiParameterToPrimitiveType<{
    name: "shares";
    type: "uint256";
    internalType: "uint256";
  }>;
};

/**
 * Calls the "previewMint" function on the contract.
 * @param options - The options for the previewMint function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { previewMint } from "thirdweb/extensions/erc4626";
 *
 * const result = await previewMint({
 *  shares: ...,
 * });
 *
 * ```
 */
export async function previewMint(
  options: BaseTransactionOptions<PreviewMintParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xb3d7f6b9",
      [
        {
          name: "shares",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
    ],
    params: [options.shares],
  });
}
