import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "deleteRule" function.
 */
export type DeleteRuleParams = {
  ruleId: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "ruleId";
    type: "bytes32";
  }>;
};

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
    method: [
      "0x9d907761",
      [
        {
          internalType: "bytes32",
          name: "ruleId",
          type: "bytes32",
        },
      ],
      [],
    ],
    params: [options.ruleId],
  });
}
