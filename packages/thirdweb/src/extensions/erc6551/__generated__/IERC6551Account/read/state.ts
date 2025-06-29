import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xc19d93fb" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `state` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `state` method is supported.
 * @extension ERC6551
 * @example
 * ```ts
 * import { isStateSupported } from "thirdweb/extensions/erc6551";
 * const supported = isStateSupported(["0x..."]);
 * ```
 */
export function isStateSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the state function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC6551
 * @example
 * ```ts
 * import { decodeStateResult } from "thirdweb/extensions/erc6551";
 * const result = decodeStateResultResult("...");
 * ```
 */
export function decodeStateResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "state" function on the contract.
 * @param options - The options for the state function.
 * @returns The parsed result of the function call.
 * @extension ERC6551
 * @example
 * ```ts
 * import { state } from "thirdweb/extensions/erc6551";
 *
 * const result = await state({
 *  contract,
 * });
 *
 * ```
 */
export async function state(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
