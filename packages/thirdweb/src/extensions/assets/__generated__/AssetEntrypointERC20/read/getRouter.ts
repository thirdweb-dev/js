import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xb0f479a1" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "router",
  },
] as const;

/**
 * Checks if the `getRouter` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getRouter` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isGetRouterSupported } from "thirdweb/extensions/assets";
 * const supported = isGetRouterSupported(["0x..."]);
 * ```
 */
export function isGetRouterSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getRouter function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ASSETS
 * @example
 * ```ts
 * import { decodeGetRouterResult } from "thirdweb/extensions/assets";
 * const result = decodeGetRouterResultResult("...");
 * ```
 */
export function decodeGetRouterResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getRouter" function on the contract.
 * @param options - The options for the getRouter function.
 * @returns The parsed result of the function call.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getRouter } from "thirdweb/extensions/assets";
 *
 * const result = await getRouter({
 *  contract,
 * });
 *
 * ```
 */
export async function getRouter(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
