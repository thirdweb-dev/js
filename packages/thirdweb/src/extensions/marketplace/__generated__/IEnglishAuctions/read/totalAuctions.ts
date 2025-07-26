import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x16002f4a" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `totalAuctions` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `totalAuctions` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isTotalAuctionsSupported } from "thirdweb/extensions/marketplace";
 * const supported = isTotalAuctionsSupported(["0x..."]);
 * ```
 */
export function isTotalAuctionsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the totalAuctions function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeTotalAuctionsResult } from "thirdweb/extensions/marketplace";
 * const result = decodeTotalAuctionsResultResult("...");
 * ```
 */
export function decodeTotalAuctionsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "totalAuctions" function on the contract.
 * @param options - The options for the totalAuctions function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { totalAuctions } from "thirdweb/extensions/marketplace";
 *
 * const result = await totalAuctions({
 *  contract,
 * });
 *
 * ```
 */
export async function totalAuctions(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
