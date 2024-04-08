import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "deleteRule" function.
 */

export type DeleteRuleParams = {
  ruleId: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "ruleId" }>;
};

export const FN_SELECTOR = "0x9d907761" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "ruleId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "deleteRule" function.
 * @param options - The options for the deleteRule function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeDeleteRuleParams } "thirdweb/extensions/thirdweb";
 * const result = encodeDeleteRuleParams({
 *  ruleId: ...,
 * });
 * ```
 */
export function encodeDeleteRuleParams(options: DeleteRuleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.ruleId]);
}

/**
 * Calls the "deleteRule" function on the contract.
 * @param options - The options for the "deleteRule" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { deleteRule } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = deleteRule({
 *  contract,
 *  ruleId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deleteRule(
  options: BaseTransactionOptions<
    | DeleteRuleParams
    | {
        asyncParams: () => Promise<DeleteRuleParams>;
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
            return [resolvedParams.ruleId] as const;
          }
        : [options.ruleId],
  });
}
