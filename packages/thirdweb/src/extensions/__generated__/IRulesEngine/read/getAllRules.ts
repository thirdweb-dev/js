import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the getAllRules function on the contract.
 * @param options - The options for the getAllRules function.
 * @returns The parsed result of the function call.
 * @extension IRULESENGINE
 * @example
 * ```
 * import { getAllRules } from "thirdweb/extensions/IRulesEngine";
 *
 * const result = await getAllRules();
 *
 * ```
 */
export async function getAllRules(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x1184aef2",
      [],
      [
        {
          components: [
            {
              internalType: "bytes32",
              name: "ruleId",
              type: "bytes32",
            },
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
            {
              internalType: "enum IRulesEngine.RuleType",
              name: "ruleType",
              type: "uint8",
            },
          ],
          internalType: "struct IRulesEngine.RuleWithId[]",
          name: "rules",
          type: "tuple[]",
        },
      ],
    ],
    params: [],
  });
}
