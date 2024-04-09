import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "changeRecoveryAddress" function.
 */

export type ChangeRecoveryAddressParams = {
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
};

export const FN_SELECTOR = "0xf1f0b224" as const;
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
 * ```ts
 * import { encodeChangeRecoveryAddressParams } "thirdweb/extensions/farcaster";
 * const result = encodeChangeRecoveryAddressParams({
 *  recovery: ...,
 * });
 * ```
 */
export function encodeChangeRecoveryAddressParams(
  options: ChangeRecoveryAddressParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.recovery]);
}

/**
 * Calls the "changeRecoveryAddress" function on the contract.
 * @param options - The options for the "changeRecoveryAddress" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { changeRecoveryAddress } from "thirdweb/extensions/farcaster";
 *
 * const transaction = changeRecoveryAddress({
 *  contract,
 *  recovery: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function changeRecoveryAddress(
  options: BaseTransactionOptions<
    | ChangeRecoveryAddressParams
    | {
        asyncParams: () => Promise<ChangeRecoveryAddressParams>;
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
            return [resolvedParams.recovery] as const;
          }
        : [options.recovery],
  });
}
