import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "createRuleThreshold" function.
 */
export type CreateRuleThresholdParams = {
  rule: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "token"; type: "address" },
      {
        internalType: "enum IRulesEngine.TokenType";
        name: "tokenType";
        type: "uint8";
      },
      { internalType: "uint256"; name: "tokenId"; type: "uint256" },
      { internalType: "uint256"; name: "balance"; type: "uint256" },
      { internalType: "uint256"; name: "score"; type: "uint256" },
    ];
    internalType: "struct IRulesEngine.RuleTypeThreshold";
    name: "rule";
    type: "tuple";
  }>;
};

/**
 * Calls the "createRuleThreshold" function on the contract.
 * @param options - The options for the "createRuleThreshold" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { createRuleThreshold } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = createRuleThreshold({
 *  rule: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createRuleThreshold(
  options: BaseTransactionOptions<CreateRuleThresholdParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x1022a25e",
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
              name: "balance",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "score",
              type: "uint256",
            },
          ],
          internalType: "struct IRulesEngine.RuleTypeThreshold",
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
