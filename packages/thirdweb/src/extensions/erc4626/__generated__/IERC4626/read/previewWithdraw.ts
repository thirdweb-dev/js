import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "previewWithdraw" function.
 */
export type PreviewWithdrawParams = {
  assets: AbiParameterToPrimitiveType<{
    name: "assets";
    type: "uint256";
    internalType: "uint256";
  }>;
};

/**
 * Calls the "previewWithdraw" function on the contract.
 * @param options - The options for the previewWithdraw function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { previewWithdraw } from "thirdweb/extensions/erc4626";
 *
 * const result = await previewWithdraw({
 *  assets: ...,
 * });
 *
 * ```
 */
export async function previewWithdraw(
  options: BaseTransactionOptions<PreviewWithdrawParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x0a28a477",
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
