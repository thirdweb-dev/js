import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x40df0ba0" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `usdUnitPrice` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `usdUnitPrice` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isUsdUnitPriceSupported } from "thirdweb/extensions/farcaster";
 * const supported = isUsdUnitPriceSupported(["0x..."]);
 * ```
 */
export function isUsdUnitPriceSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the usdUnitPrice function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeUsdUnitPriceResult } from "thirdweb/extensions/farcaster";
 * const result = decodeUsdUnitPriceResultResult("...");
 * ```
 */
export function decodeUsdUnitPriceResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "usdUnitPrice" function on the contract.
 * @param options - The options for the usdUnitPrice function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { usdUnitPrice } from "thirdweb/extensions/farcaster";
 *
 * const result = await usdUnitPrice({
 *  contract,
 * });
 *
 * ```
 */
export async function usdUnitPrice(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
