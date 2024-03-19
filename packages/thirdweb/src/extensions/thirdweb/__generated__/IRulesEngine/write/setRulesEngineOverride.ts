import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setRulesEngineOverride" function.
 */

type SetRulesEngineOverrideParamsInternal = {
  rulesEngineAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_rulesEngineAddress";
  }>;
};

export type SetRulesEngineOverrideParams = Prettify<
  | SetRulesEngineOverrideParamsInternal
  | {
      asyncParams: () => Promise<SetRulesEngineOverrideParamsInternal>;
    }
>;
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
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.rulesEngineAddress] as const;
      }

      return [options.rulesEngineAddress] as const;
    },
  });
}
