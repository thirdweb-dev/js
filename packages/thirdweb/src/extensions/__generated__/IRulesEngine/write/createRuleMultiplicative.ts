import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "createRuleMultiplicative" function.
 */
export type CreateRuleMultiplicativeParams = {
  rule: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "token"; type: "address" },
      {
        internalType: "enum IRulesEngine.TokenType";
        name: "tokenType";
        type: "uint8";
      },
      { internalType: "uint256"; name: "tokenId"; type: "uint256" },
      { internalType: "uint256"; name: "scorePerOwnedToken"; type: "uint256" },
    ];
    internalType: "struct IRulesEngine.RuleTypeMultiplicative";
    name: "rule";
    type: "tuple";
  }>;
};

/**
 * Calls the createRuleMultiplicative function on the contract.
 * @param options - The options for the createRuleMultiplicative function.
 * @returns A prepared transaction object.
 * @extension IRULESENGINE
 * @example
 * ```
 * import { createRuleMultiplicative } from "thirdweb/extensions/IRulesEngine";
 *
 * const transaction = createRuleMultiplicative({
 *  rule: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createRuleMultiplicative(
  options: BaseTransactionOptions<CreateRuleMultiplicativeParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x1e2e9cb5",
      [
        {
          components: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              internalType: "enum IRulesEngine.TokenType",
              name: "tokenType",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "scorePerOwnedToken",
              type: "uint256",
            },
          ],
          internalType: "struct IRulesEngine.RuleTypeMultiplicative",
          name: "rule",
          type: "tuple",
        },
      ],
      [
        {
          internalType: "bytes32",
          name: "ruleId",
          type: "bytes32",
        },
      ],
    ],
    params: [options.rule],
  });
}
