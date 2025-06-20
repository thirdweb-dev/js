import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x9cfd7cff" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "accountImplementationId",
    type: "string",
  },
] as const;

/**
 * Checks if the `accountId` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `accountId` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isAccountIdSupported } from "thirdweb/extensions/erc7579";
 * const supported = isAccountIdSupported(["0x..."]);
 * ```
 */
export function isAccountIdSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the accountId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeAccountIdResult } from "thirdweb/extensions/erc7579";
 * const result = decodeAccountIdResultResult("...");
 * ```
 */
export function decodeAccountIdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "accountId" function on the contract.
 * @param options - The options for the accountId function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { accountId } from "thirdweb/extensions/erc7579";
 *
 * const result = await accountId({
 *  contract,
 * });
 *
 * ```
 */
export async function accountId(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
