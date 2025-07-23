import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xd0fb0203" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `feeManager` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `feeManager` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isFeeManagerSupported } from "thirdweb/extensions/tokens";
 * const supported = isFeeManagerSupported(["0x..."]);
 * ```
 */
export function isFeeManagerSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the feeManager function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeFeeManagerResult } from "thirdweb/extensions/tokens";
 * const result = decodeFeeManagerResultResult("...");
 * ```
 */
export function decodeFeeManagerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "feeManager" function on the contract.
 * @param options - The options for the feeManager function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { feeManager } from "thirdweb/extensions/tokens";
 *
 * const result = await feeManager({
 *  contract,
 * });
 *
 * ```
 */
export async function feeManager(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
