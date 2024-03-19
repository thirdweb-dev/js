import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "openPackAndClaimRewards" function.
 */

type OpenPackAndClaimRewardsParamsInternal = {
  packId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_packId" }>;
  amountToOpen: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_amountToOpen";
  }>;
  callBackGasLimit: AbiParameterToPrimitiveType<{
    type: "uint32";
    name: "_callBackGasLimit";
  }>;
};

export type OpenPackAndClaimRewardsParams = Prettify<
  | OpenPackAndClaimRewardsParamsInternal
  | {
      asyncParams: () => Promise<OpenPackAndClaimRewardsParamsInternal>;
    }
>;
/**
 * Calls the "openPackAndClaimRewards" function on the contract.
 * @param options - The options for the "openPackAndClaimRewards" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { openPackAndClaimRewards } from "thirdweb/extensions/erc1155";
 *
 * const transaction = openPackAndClaimRewards({
 *  packId: ...,
 *  amountToOpen: ...,
 *  callBackGasLimit: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function openPackAndClaimRewards(
  options: BaseTransactionOptions<OpenPackAndClaimRewardsParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xac296b3f",
      [
        {
          type: "uint256",
          name: "_packId",
        },
        {
          type: "uint256",
          name: "_amountToOpen",
        },
        {
          type: "uint32",
          name: "_callBackGasLimit",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [
          resolvedParams.packId,
          resolvedParams.amountToOpen,
          resolvedParams.callBackGasLimit,
        ] as const;
      }

      return [
        options.packId,
        options.amountToOpen,
        options.callBackGasLimit,
      ] as const;
    },
  });
}
