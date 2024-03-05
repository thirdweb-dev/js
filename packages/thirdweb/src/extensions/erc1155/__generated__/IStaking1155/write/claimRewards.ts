import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "claimRewards" function.
 */
export type ClaimRewardsParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

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
    params: [options.tokenId],
  });
}
