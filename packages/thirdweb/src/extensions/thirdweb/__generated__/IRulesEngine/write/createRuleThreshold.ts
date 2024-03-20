import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "createRuleThreshold" function.
 */

type CreateRuleThresholdParamsInternal = {
  rule: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "rule";
    components: [
      { type: "address"; name: "token" },
      { type: "uint8"; name: "tokenType" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "balance" },
      { type: "uint256"; name: "score" },
    ];
  }>;
};

export type CreateRuleThresholdParams = Prettify<
  | CreateRuleThresholdParamsInternal
  | {
      asyncParams: () => Promise<CreateRuleThresholdParamsInternal>;
    }
>;
const METHOD = [
  "0x1022a25e",
  [
    {
      type: "tuple",
      name: "rule",
      components: [
        {
          type: "address",
          name: "token",
        },
        {
          type: "uint8",
          name: "tokenType",
        },
        {
          type: "uint256",
          name: "tokenId",
        },
        {
          type: "uint256",
          name: "balance",
        },
        {
          type: "uint256",
          name: "score",
        },
      ],
    },
  ],
  [
    {
      type: "bytes32",
      name: "ruleId",
    },
  ],
] as const;

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
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.rule] as const;
          }
        : [options.rule],
  });
}
