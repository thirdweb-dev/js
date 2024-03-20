import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x1184aef2",
  [],
  [
    {
      type: "tuple[]",
      name: "rules",
      components: [
        {
          type: "bytes32",
          name: "ruleId",
        },
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
        {
          type: "uint8",
          name: "ruleType",
        },
      ],
    },
  ],
] as const;

/**
 * Calls the "getAllRules" function on the contract.
 * @param options - The options for the getAllRules function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { getAllRules } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getAllRules();
 *
 * ```
 */
export async function getAllRules(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
