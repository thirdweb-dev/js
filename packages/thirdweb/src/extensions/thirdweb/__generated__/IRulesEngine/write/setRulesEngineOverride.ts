import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setRulesEngineOverride" function.
 */

export type SetRulesEngineOverrideParams = {
  rulesEngineAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_rulesEngineAddress";
  }>;
};

export const FN_SELECTOR = "0x0eb0adb6" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_rulesEngineAddress",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setRulesEngineOverride" function.
 * @param options - The options for the setRulesEngineOverride function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeSetRulesEngineOverrideParams } "thirdweb/extensions/thirdweb";
 * const result = encodeSetRulesEngineOverrideParams({
 *  rulesEngineAddress: ...,
 * });
 * ```
 */
export function encodeSetRulesEngineOverrideParams(
  options: SetRulesEngineOverrideParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.rulesEngineAddress]);
}

/**
 * Calls the "setRulesEngineOverride" function on the contract.
 * @param options - The options for the "setRulesEngineOverride" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { setRulesEngineOverride } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = setRulesEngineOverride({
 *  contract,
 *  rulesEngineAddress: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setRulesEngineOverride(
  options: BaseTransactionOptions<
    | SetRulesEngineOverrideParams
    | {
        asyncParams: () => Promise<SetRulesEngineOverrideParams>;
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
            return [resolvedParams.rulesEngineAddress] as const;
          }
        : [options.rulesEngineAddress],
  });
}
