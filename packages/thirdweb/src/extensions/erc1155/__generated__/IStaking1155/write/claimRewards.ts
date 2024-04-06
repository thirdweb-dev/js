import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "claimRewards" function.
 */

export type ClaimRewardsParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x0962ef79" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "claimRewards" function.
 * @param options - The options for the claimRewards function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeClaimRewardsParams } "thirdweb/extensions/erc1155";
 * const result = encodeClaimRewardsParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeClaimRewardsParams(options: ClaimRewardsParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Calls the "claimRewards" function on the contract.
 * @param options - The options for the "claimRewards" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { claimRewards } from "thirdweb/extensions/erc1155";
 *
 * const transaction = claimRewards({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claimRewards(
  options: BaseTransactionOptions<
    | ClaimRewardsParams
    | {
        asyncParams: () => Promise<ClaimRewardsParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.tokenId] as const;
          }
        : [options.tokenId],
  });
}
