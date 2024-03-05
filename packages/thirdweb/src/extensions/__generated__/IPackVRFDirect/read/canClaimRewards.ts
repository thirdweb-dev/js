import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "canClaimRewards" function.
 */
export type CanClaimRewardsParams = {
  opener: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_opener";
    type: "address";
  }>;
};

/**
 * Calls the canClaimRewards function on the contract.
 * @param options - The options for the canClaimRewards function.
 * @returns The parsed result of the function call.
 * @extension IPACKVRFDIRECT
 * @example
 * ```
 * import { canClaimRewards } from "thirdweb/extensions/IPackVRFDirect";
 *
 * const result = await canClaimRewards({
 *  opener: ...,
 * });
 *
 * ```
 */
export async function canClaimRewards(
  options: BaseTransactionOptions<CanClaimRewardsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xa9b47a66",
      [
        {
          internalType: "address",
          name: "_opener",
          type: "address",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.opener],
  });
}
