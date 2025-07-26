import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x58451f97" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `totalAccounts` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `totalAccounts` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isTotalAccountsSupported } from "thirdweb/extensions/erc4337";
 * const supported = isTotalAccountsSupported(["0x..."]);
 * ```
 */
export function isTotalAccountsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the totalAccounts function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeTotalAccountsResult } from "thirdweb/extensions/erc4337";
 * const result = decodeTotalAccountsResultResult("...");
 * ```
 */
export function decodeTotalAccountsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "totalAccounts" function on the contract.
 * @param options - The options for the totalAccounts function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { totalAccounts } from "thirdweb/extensions/erc4337";
 *
 * const result = await totalAccounts({
 *  contract,
 * });
 *
 * ```
 */
export async function totalAccounts(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
