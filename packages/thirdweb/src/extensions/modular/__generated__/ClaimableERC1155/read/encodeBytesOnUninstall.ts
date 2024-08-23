import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xf5b75d2a" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "bytes",
    internalType: "bytes",
  },
] as const;

/**
 * Checks if the `encodeBytesOnUninstall` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `encodeBytesOnUninstall` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isEncodeBytesOnUninstallSupported } from "thirdweb/extensions/modular";
 *
 * const supported = isEncodeBytesOnUninstallSupported(["0x..."]);
 * ```
 */
export function isEncodeBytesOnUninstallSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the encodeBytesOnUninstall function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeEncodeBytesOnUninstallResult } from "thirdweb/extensions/modular";
 * const result = decodeEncodeBytesOnUninstallResult("...");
 * ```
 */
export function decodeEncodeBytesOnUninstallResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "encodeBytesOnUninstall" function on the contract.
 * @param options - The options for the encodeBytesOnUninstall function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBytesOnUninstall } from "thirdweb/extensions/modular";
 *
 * const result = await encodeBytesOnUninstall({
 *  contract,
 * });
 *
 * ```
 */
export async function encodeBytesOnUninstall(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
