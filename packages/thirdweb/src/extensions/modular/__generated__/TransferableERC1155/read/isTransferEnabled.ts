import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xcca5dcb6" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isTransferEnabled` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `isTransferEnabled` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isIsTransferEnabledSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isIsTransferEnabledSupported(contract);
 * ```
 */
export async function isIsTransferEnabledSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the isTransferEnabled function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeIsTransferEnabledResult } from "thirdweb/extensions/modular";
 * const result = decodeIsTransferEnabledResult("...");
 * ```
 */
export function decodeIsTransferEnabledResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isTransferEnabled" function on the contract.
 * @param options - The options for the isTransferEnabled function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isTransferEnabled } from "thirdweb/extensions/modular";
 *
 * const result = await isTransferEnabled({
 *  contract,
 * });
 *
 * ```
 */
export async function isTransferEnabled(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
