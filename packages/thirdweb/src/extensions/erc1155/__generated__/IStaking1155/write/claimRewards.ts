import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "claimRewards" function.
 */

type ClaimRewardsParamsInternal = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export type ClaimRewardsParams = Prettify<
  | ClaimRewardsParamsInternal
  | {
      asyncParams: () => Promise<ClaimRewardsParamsInternal>;
    }
>;
/**
 * Calls the "claimRewards" function on the contract.
 * @param options - The options for the "claimRewards" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { claimRewards } from "thirdweb/extensions/erc1155";
 *
 * const transaction = claimRewards({
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claimRewards(
  options: BaseTransactionOptions<ClaimRewardsParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x0962ef79",
      [
        {
          type: "uint256",
          name: "tokenId",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.tokenId] as const;
          }
        : [options.tokenId],
  });
}
