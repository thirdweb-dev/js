import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setOwner" function.
 */

type SetOwnerParamsInternal = {
  newOwner: AbiParameterToPrimitiveType<{ type: "address"; name: "_newOwner" }>;
};

export type SetOwnerParams = Prettify<
  | SetOwnerParamsInternal
  | {
      asyncParams: () => Promise<SetOwnerParamsInternal>;
    }
>;
const FN_SELECTOR = "0x13af4035" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_newOwner",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setOwner" function.
 * @param options - The options for the setOwner function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```
 * import { encodeSetOwnerParams } "thirdweb/extensions/common";
 * const result = encodeSetOwnerParams({
 *  newOwner: ...,
 * });
 * ```
 */
export function encodeSetOwnerParams(options: SetOwnerParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.newOwner]);
}

/**
 * Calls the "setOwner" function on the contract.
 * @param options - The options for the "setOwner" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { setOwner } from "thirdweb/extensions/common";
 *
 * const transaction = setOwner({
 *  newOwner: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setOwner(options: BaseTransactionOptions<SetOwnerParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.newOwner] as const;
          }
        : [options.newOwner],
  });
}
