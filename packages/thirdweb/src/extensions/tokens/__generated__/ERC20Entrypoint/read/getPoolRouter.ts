import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x824f512c" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "poolRouter",
  },
] as const;

/**
 * Checks if the `getPoolRouter` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getPoolRouter` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isGetPoolRouterSupported } from "thirdweb/extensions/tokens";
 * const supported = isGetPoolRouterSupported(["0x..."]);
 * ```
 */
export function isGetPoolRouterSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getPoolRouter function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeGetPoolRouterResult } from "thirdweb/extensions/tokens";
 * const result = decodeGetPoolRouterResultResult("...");
 * ```
 */
export function decodeGetPoolRouterResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPoolRouter" function on the contract.
 * @param options - The options for the getPoolRouter function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getPoolRouter } from "thirdweb/extensions/tokens";
 *
 * const result = await getPoolRouter({
 *  contract,
 * });
 *
 * ```
 */
export async function getPoolRouter(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
