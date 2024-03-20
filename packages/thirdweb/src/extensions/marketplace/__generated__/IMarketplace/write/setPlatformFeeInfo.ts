import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setPlatformFeeInfo" function.
 */

type SetPlatformFeeInfoParamsInternal = {
  platformFeeRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_platformFeeRecipient";
  }>;
  platformFeeBps: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_platformFeeBps";
  }>;
};

export type SetPlatformFeeInfoParams = Prettify<
  | SetPlatformFeeInfoParamsInternal
  | {
      asyncParams: () => Promise<SetPlatformFeeInfoParamsInternal>;
    }
>;
const FN_SELECTOR = "0x1e7ac488" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_platformFeeRecipient",
  },
  {
    type: "uint256",
    name: "_platformFeeBps",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setPlatformFeeInfo" function.
 * @param options - The options for the setPlatformFeeInfo function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { encodeSetPlatformFeeInfoParams } "thirdweb/extensions/marketplace";
 * const result = encodeSetPlatformFeeInfoParams({
 *  platformFeeRecipient: ...,
 *  platformFeeBps: ...,
 * });
 * ```
 */
export function encodeSetPlatformFeeInfoParams(
  options: SetPlatformFeeInfoParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.platformFeeRecipient,
    options.platformFeeBps,
  ]);
}

/**
 * Calls the "setPlatformFeeInfo" function on the contract.
 * @param options - The options for the "setPlatformFeeInfo" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { setPlatformFeeInfo } from "thirdweb/extensions/marketplace";
 *
 * const transaction = setPlatformFeeInfo({
 *  platformFeeRecipient: ...,
 *  platformFeeBps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setPlatformFeeInfo(
  options: BaseTransactionOptions<SetPlatformFeeInfoParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.platformFeeRecipient,
              resolvedParams.platformFeeBps,
            ] as const;
          }
        : [options.platformFeeRecipient, options.platformFeeBps],
  });
}
