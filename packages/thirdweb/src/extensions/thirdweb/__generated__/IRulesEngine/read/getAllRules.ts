import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x1184aef2" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "ruleId",
        type: "bytes32",
      },
      {
        name: "token",
        type: "address",
      },
      {
        name: "tokenType",
        type: "uint8",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "balance",
        type: "uint256",
      },
      {
        name: "score",
        type: "uint256",
      },
      {
        name: "ruleType",
        type: "uint8",
      },
    ],
    name: "rules",
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `getAllRules` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAllRules` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isGetAllRulesSupported } from "thirdweb/extensions/thirdweb";
 * const supported = isGetAllRulesSupported(["0x..."]);
 * ```
 */
export function isGetAllRulesSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getAllRules function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetAllRulesResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetAllRulesResultResult("...");
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
 * const result = await getAllRules({
 *  contract,
 * });
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
