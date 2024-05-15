import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x00bf26f4" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `TRANSFER_TYPEHASH` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `TRANSFER_TYPEHASH` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isTRANSFER_TYPEHASHSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isTRANSFER_TYPEHASHSupported(contract);
 * ```
 */
export async function isTRANSFER_TYPEHASHSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the TRANSFER_TYPEHASH function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeTRANSFER_TYPEHASHResult } from "thirdweb/extensions/farcaster";
 * const result = decodeTRANSFER_TYPEHASHResult("...");
 * ```
 */
export function decodeTRANSFER_TYPEHASHResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "TRANSFER_TYPEHASH" function on the contract.
 * @param options - The options for the TRANSFER_TYPEHASH function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { TRANSFER_TYPEHASH } from "thirdweb/extensions/farcaster";
 *
 * const result = await TRANSFER_TYPEHASH({
 *  contract,
 * });
 *
 * ```
 */
export async function TRANSFER_TYPEHASH(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
