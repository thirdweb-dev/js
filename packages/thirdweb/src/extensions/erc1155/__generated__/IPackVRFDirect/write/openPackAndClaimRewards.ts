import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "openPackAndClaimRewards" function.
 */

export type OpenPackAndClaimRewardsParams = {
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

export const FN_SELECTOR = "0xac296b3f" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "openPackAndClaimRewards" function.
 * @param options - The options for the openPackAndClaimRewards function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeOpenPackAndClaimRewardsParams } "thirdweb/extensions/erc1155";
 * const result = encodeOpenPackAndClaimRewardsParams({
 *  packId: ...,
 *  amountToOpen: ...,
 *  callBackGasLimit: ...,
 * });
 * ```
 */
export function encodeOpenPackAndClaimRewardsParams(
  options: OpenPackAndClaimRewardsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.packId,
    options.amountToOpen,
    options.callBackGasLimit,
  ]);
}

/**
 * Calls the "openPackAndClaimRewards" function on the contract.
 * @param options - The options for the "openPackAndClaimRewards" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { openPackAndClaimRewards } from "thirdweb/extensions/erc1155";
 *
 * const transaction = openPackAndClaimRewards({
 *  contract,
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
  options: BaseTransactionOptions<
    | OpenPackAndClaimRewardsParams
    | {
        asyncParams: () => Promise<OpenPackAndClaimRewardsParams>;
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
            return [
              resolvedParams.packId,
              resolvedParams.amountToOpen,
              resolvedParams.callBackGasLimit,
            ] as const;
          }
        : [options.packId, options.amountToOpen, options.callBackGasLimit],
  });
}
