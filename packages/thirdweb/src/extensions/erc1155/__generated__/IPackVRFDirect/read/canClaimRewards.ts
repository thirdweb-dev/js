import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "canClaimRewards" function.
 */
export type CanClaimRewardsParams = {
  opener: AbiParameterToPrimitiveType<{ type: "address"; name: "_opener" }>;
};

const METHOD = [
  "0xa9b47a66",
  [
    {
      type: "address",
      name: "_opener",
    },
  ],
  [
    {
      type: "bool",
    },
  ],
] as const;

/**
 * Calls the "canClaimRewards" function on the contract.
 * @param options - The options for the canClaimRewards function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```
 * import { canClaimRewards } from "thirdweb/extensions/erc1155";
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
    method: METHOD,
    params: [options.opener],
  });
}
