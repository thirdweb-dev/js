import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x95e7549f" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `gatewayFrozen` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `gatewayFrozen` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isGatewayFrozenSupported } from "thirdweb/extensions/farcaster";
 * const supported = isGatewayFrozenSupported(["0x..."]);
 * ```
 */
export function isGatewayFrozenSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the gatewayFrozen function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeGatewayFrozenResult } from "thirdweb/extensions/farcaster";
 * const result = decodeGatewayFrozenResultResult("...");
 * ```
 */
export function decodeGatewayFrozenResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "gatewayFrozen" function on the contract.
 * @param options - The options for the gatewayFrozen function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { gatewayFrozen } from "thirdweb/extensions/farcaster";
 *
 * const result = await gatewayFrozen({
 *  contract,
 * });
 *
 * ```
 */
export async function gatewayFrozen(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
