import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setRulesEngineOverride" function.
 */
export type SetRulesEngineOverrideParams = {
  rulesEngineAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_rulesEngineAddress";
  }>;
};

/**
 * Calls the "setRulesEngineOverride" function on the contract.
 * @param options - The options for the "setRulesEngineOverride" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { setRulesEngineOverride } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = setRulesEngineOverride({
 *  rulesEngineAddress: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setRulesEngineOverride(
  options: BaseTransactionOptions<SetRulesEngineOverrideParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x0eb0adb6",
      [
        {
          type: "address",
          name: "_rulesEngineAddress",
        },
      ],
      [],
    ],
    params: [options.rulesEngineAddress],
  });
}
