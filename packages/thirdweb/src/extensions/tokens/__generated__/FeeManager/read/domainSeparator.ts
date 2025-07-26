import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xf698da25" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `domainSeparator` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `domainSeparator` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isDomainSeparatorSupported } from "thirdweb/extensions/tokens";
 * const supported = isDomainSeparatorSupported(["0x..."]);
 * ```
 */
export function isDomainSeparatorSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the domainSeparator function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeDomainSeparatorResult } from "thirdweb/extensions/tokens";
 * const result = decodeDomainSeparatorResultResult("...");
 * ```
 */
export function decodeDomainSeparatorResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "domainSeparator" function on the contract.
 * @param options - The options for the domainSeparator function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { domainSeparator } from "thirdweb/extensions/tokens";
 *
 * const result = await domainSeparator({
 *  contract,
 * });
 *
 * ```
 */
export async function domainSeparator(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
