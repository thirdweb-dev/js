import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xfec7ff72" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "bytes",
  },
] as const;

/**
 * Checks if the `encodeBytesOnInstall` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `encodeBytesOnInstall` method is supported.
 * @module TransferableERC1155
 * @example
 * ```ts
 * import { TransferableERC1155 } from "thirdweb/modules";
 * const supported = TransferableERC1155.isEncodeBytesOnInstallSupported(["0x..."]);
 * ```
 */
export function isEncodeBytesOnInstallSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the encodeBytesOnInstall function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @module TransferableERC1155
 * @example
 * ```ts
 * import { TransferableERC1155 } from "thirdweb/modules";
 * const result = TransferableERC1155.decodeEncodeBytesOnInstallResultResult("...");
 * ```
 */
export function decodeEncodeBytesOnInstallResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "encodeBytesOnInstall" function on the contract.
 * @param options - The options for the encodeBytesOnInstall function.
 * @returns The parsed result of the function call.
 * @module TransferableERC1155
 * @example
 * ```ts
 * import { TransferableERC1155 } from "thirdweb/modules";
 *
 * const result = await TransferableERC1155.encodeBytesOnInstall({
 *  contract,
 * });
 *
 * ```
 */
export async function encodeBytesOnInstall(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
