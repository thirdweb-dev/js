import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
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
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `encodeBytesOnInstall` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isEncodeBytesOnInstallSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isEncodeBytesOnInstallSupported(contract);
 * ```
 */
export async function isEncodeBytesOnInstallSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the encodeBytesOnInstall function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeEncodeBytesOnInstallResult } from "thirdweb/extensions/modular";
 * const result = decodeEncodeBytesOnInstallResult("...");
 * ```
 */
export function decodeEncodeBytesOnInstallResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "encodeBytesOnInstall" function on the contract.
 * @param options - The options for the encodeBytesOnInstall function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBytesOnInstall } from "thirdweb/extensions/modular";
 *
 * const result = await encodeBytesOnInstall({
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
