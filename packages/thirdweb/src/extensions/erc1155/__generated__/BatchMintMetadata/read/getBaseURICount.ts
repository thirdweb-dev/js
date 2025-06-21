import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x63b45e2d" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getBaseURICount` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getBaseURICount` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isGetBaseURICountSupported } from "thirdweb/extensions/erc1155";
 * const supported = isGetBaseURICountSupported(["0x..."]);
 * ```
 */
export function isGetBaseURICountSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getBaseURICount function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeGetBaseURICountResult } from "thirdweb/extensions/erc1155";
 * const result = decodeGetBaseURICountResultResult("...");
 * ```
 */
export function decodeGetBaseURICountResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getBaseURICount" function on the contract.
 * @param options - The options for the getBaseURICount function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getBaseURICount } from "thirdweb/extensions/erc1155";
 *
 * const result = await getBaseURICount({
 *  contract,
 * });
 *
 * ```
 */
export async function getBaseURICount(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
