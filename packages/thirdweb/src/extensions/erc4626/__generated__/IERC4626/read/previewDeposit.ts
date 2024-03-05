import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "previewDeposit" function.
 */
export type PreviewDepositParams = {
  assets: AbiParameterToPrimitiveType<{
    name: "assets";
    type: "uint256";
    internalType: "uint256";
  }>;
};

/**
 * Calls the "previewDeposit" function on the contract.
 * @param options - The options for the previewDeposit function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { previewDeposit } from "thirdweb/extensions/erc4626";
 *
 * const result = await previewDeposit({
 *  assets: ...,
 * });
 *
 * ```
 */
export async function previewDeposit(
  options: BaseTransactionOptions<PreviewDepositParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xef8b30f7",
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
