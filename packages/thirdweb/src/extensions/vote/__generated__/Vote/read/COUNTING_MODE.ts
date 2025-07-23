import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xdd4e2ba5" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Checks if the `COUNTING_MODE` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `COUNTING_MODE` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isCOUNTING_MODESupported } from "thirdweb/extensions/vote";
 * const supported = isCOUNTING_MODESupported(["0x..."]);
 * ```
 */
export function isCOUNTING_MODESupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the COUNTING_MODE function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeCOUNTING_MODEResult } from "thirdweb/extensions/vote";
 * const result = decodeCOUNTING_MODEResultResult("...");
 * ```
 */
export function decodeCOUNTING_MODEResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "COUNTING_MODE" function on the contract.
 * @param options - The options for the COUNTING_MODE function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { COUNTING_MODE } from "thirdweb/extensions/vote";
 *
 * const result = await COUNTING_MODE({
 *  contract,
 * });
 *
 * ```
 */
export async function COUNTING_MODE(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
