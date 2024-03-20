import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "deleteRule" function.
 */

type DeleteRuleParamsInternal = {
  ruleId: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "ruleId" }>;
};

export type DeleteRuleParams = Prettify<
  | DeleteRuleParamsInternal
  | {
      asyncParams: () => Promise<DeleteRuleParamsInternal>;
    }
>;
const METHOD = [
  "0x9d907761",
  [
    {
      type: "bytes32",
      name: "ruleId",
    },
  ],
  [],
] as const;

/**
 * Calls the "deleteRule" function on the contract.
 * @param options - The options for the "deleteRule" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { deleteRule } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = deleteRule({
 *  ruleId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deleteRule(options: BaseTransactionOptions<DeleteRuleParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.ruleId] as const;
          }
        : [options.ruleId],
  });
}
