import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "createRuleMultiplicative" function.
 */

type CreateRuleMultiplicativeParamsInternal = {
  rule: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "rule";
    components: [
      { type: "address"; name: "token" },
      { type: "uint8"; name: "tokenType" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "scorePerOwnedToken" },
    ];
  }>;
};

export type CreateRuleMultiplicativeParams = Prettify<
  | CreateRuleMultiplicativeParamsInternal
  | {
      asyncParams: () => Promise<CreateRuleMultiplicativeParamsInternal>;
    }
>;
/**
 * Calls the "createRuleMultiplicative" function on the contract.
 * @param options - The options for the "createRuleMultiplicative" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { createRuleMultiplicative } from "thirdweb/extensions/thirdweb";
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
              name: "scorePerOwnedToken",
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
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.rule] as const;
      }

      return [options.rule] as const;
    },
  });
}
