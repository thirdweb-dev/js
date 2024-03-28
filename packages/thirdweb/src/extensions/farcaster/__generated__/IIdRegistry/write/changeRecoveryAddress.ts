import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "changeRecoveryAddress" function.
 */

type ChangeRecoveryAddressParamsInternal = {
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
};

export type ChangeRecoveryAddressParams = Prettify<
  | ChangeRecoveryAddressParamsInternal
  | {
      asyncParams: () => Promise<ChangeRecoveryAddressParamsInternal>;
    }
>;
const FN_SELECTOR = "0xf1f0b224" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "recovery",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "changeRecoveryAddress" function.
 * @param options - The options for the changeRecoveryAddress function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```
 * import { encodeChangeRecoveryAddressParams } "thirdweb/extensions/farcaster";
 * const result = encodeChangeRecoveryAddressParams({
 *  recovery: ...,
 * });
 * ```
 */
export function encodeChangeRecoveryAddressParams(
  options: ChangeRecoveryAddressParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.recovery]);
}

/**
 * Calls the "changeRecoveryAddress" function on the contract.
 * @param options - The options for the "changeRecoveryAddress" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { changeRecoveryAddress } from "thirdweb/extensions/farcaster";
 *
 * const transaction = changeRecoveryAddress({
 *  recovery: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function changeRecoveryAddress(
  options: BaseTransactionOptions<ChangeRecoveryAddressParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.recovery] as const;
          }
        : [options.recovery],
  });
}
