import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

const FN_SELECTOR = "0x1184aef2" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
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
] as const;

/**
 * Decodes the result of the getAllRules function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetAllRulesResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetAllRulesResult("...");
 * ```
 */
export function decodeGetAllRulesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllRules" function on the contract.
 * @param options - The options for the getAllRules function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getAllRules } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getAllRules();
 *
 * ```
 */
export async function getAllRules(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
