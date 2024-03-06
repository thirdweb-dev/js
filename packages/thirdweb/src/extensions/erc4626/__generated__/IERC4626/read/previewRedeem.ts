import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "previewRedeem" function.
 */
export type PreviewRedeemParams = {
  shares: AbiParameterToPrimitiveType<{
    name: "shares";
    type: "uint256";
    internalType: "uint256";
  }>;
};

/**
 * Calls the "previewRedeem" function on the contract.
 * @param options - The options for the previewRedeem function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { previewRedeem } from "thirdweb/extensions/erc4626";
 *
 * const result = await previewRedeem({
 *  shares: ...,
 * });
 *
 * ```
 */
export async function previewRedeem(
  options: BaseTransactionOptions<PreviewRedeemParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x4cdad506",
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
    ],
    params: [options.shares],
  });
}
