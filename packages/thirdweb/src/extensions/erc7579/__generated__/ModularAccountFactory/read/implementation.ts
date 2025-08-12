import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x5c60da1b" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "result",
    type: "address",
  },
] as const;

/**
 * Checks if the `implementation` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `implementation` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isImplementationSupported } from "thirdweb/extensions/erc7579";
 * const supported = isImplementationSupported(["0x..."]);
 * ```
 */
export function isImplementationSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the implementation function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeImplementationResult } from "thirdweb/extensions/erc7579";
 * const result = decodeImplementationResultResult("...");
 * ```
 */
export function decodeImplementationResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "implementation" function on the contract.
 * @param options - The options for the implementation function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { implementation } from "thirdweb/extensions/erc7579";
 *
 * const result = await implementation({
 *  contract,
 * });
 *
 * ```
 */
export async function implementation(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
