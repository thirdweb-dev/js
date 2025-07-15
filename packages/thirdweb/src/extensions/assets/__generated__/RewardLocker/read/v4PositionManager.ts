import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xe2f4dd43" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `v4PositionManager` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `v4PositionManager` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isV4PositionManagerSupported } from "thirdweb/extensions/assets";
 * const supported = isV4PositionManagerSupported(["0x..."]);
 * ```
 */
export function isV4PositionManagerSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the v4PositionManager function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ASSETS
 * @example
 * ```ts
 * import { decodeV4PositionManagerResult } from "thirdweb/extensions/assets";
 * const result = decodeV4PositionManagerResultResult("...");
 * ```
 */
export function decodeV4PositionManagerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "v4PositionManager" function on the contract.
 * @param options - The options for the v4PositionManager function.
 * @returns The parsed result of the function call.
 * @extension ASSETS
 * @example
 * ```ts
 * import { v4PositionManager } from "thirdweb/extensions/assets";
 *
 * const result = await v4PositionManager({
 *  contract,
 * });
 *
 * ```
 */
export async function v4PositionManager(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
