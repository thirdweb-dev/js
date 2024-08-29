import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x8da5cb5b" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "result",
  },
] as const;

/**
 * Checks if the `owner` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `owner` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isOwnerSupported } from "thirdweb/extensions/modular";
 *
 * const supported = isOwnerSupported(["0x..."]);
 * ```
 */
export function isOwnerSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the owner function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeOwnerResult } from "thirdweb/extensions/modular";
 * const result = decodeOwnerResult("...");
 * ```
 */
export function decodeOwnerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "owner" function on the contract.
 * @param options - The options for the owner function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { owner } from "thirdweb/extensions/modular";
 *
 * const result = await owner({
 *  contract,
 * });
 *
 * ```
 */
export async function owner(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
