import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setDefaultRoyaltyInfo" function.
 */

export type SetDefaultRoyaltyInfoParams = {
  royaltyRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_royaltyRecipient";
  }>;
  royaltyBps: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_royaltyBps";
  }>;
};

export const FN_SELECTOR = "0x600dd5ea" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_royaltyRecipient",
  },
  {
    type: "uint256",
    name: "_royaltyBps",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setDefaultRoyaltyInfo" function.
 * @param options - The options for the setDefaultRoyaltyInfo function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetDefaultRoyaltyInfoParams } "thirdweb/extensions/common";
 * const result = encodeSetDefaultRoyaltyInfoParams({
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 * ```
 */
export function encodeSetDefaultRoyaltyInfoParams(
  options: SetDefaultRoyaltyInfoParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.royaltyRecipient,
    options.royaltyBps,
  ]);
}

/**
 * Calls the "setDefaultRoyaltyInfo" function on the contract.
 * @param options - The options for the "setDefaultRoyaltyInfo" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { setDefaultRoyaltyInfo } from "thirdweb/extensions/common";
 *
 * const transaction = setDefaultRoyaltyInfo({
 *  contract,
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setDefaultRoyaltyInfo(
  options: BaseTransactionOptions<
    | SetDefaultRoyaltyInfoParams
    | {
        asyncParams: () => Promise<SetDefaultRoyaltyInfoParams>;
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
              resolvedParams.royaltyRecipient,
              resolvedParams.royaltyBps,
            ] as const;
          }
        : [options.royaltyRecipient, options.royaltyBps],
  });
}
