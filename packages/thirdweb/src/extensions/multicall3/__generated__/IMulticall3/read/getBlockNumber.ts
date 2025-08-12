import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x42cbb15c" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "blockNumber",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getBlockNumber` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getBlockNumber` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isGetBlockNumberSupported } from "thirdweb/extensions/multicall3";
 * const supported = isGetBlockNumberSupported(["0x..."]);
 * ```
 */
export function isGetBlockNumberSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getBlockNumber function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { decodeGetBlockNumberResult } from "thirdweb/extensions/multicall3";
 * const result = decodeGetBlockNumberResultResult("...");
 * ```
 */
export function decodeGetBlockNumberResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getBlockNumber" function on the contract.
 * @param options - The options for the getBlockNumber function.
 * @returns The parsed result of the function call.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { getBlockNumber } from "thirdweb/extensions/multicall3";
 *
 * const result = await getBlockNumber({
 *  contract,
 * });
 *
 * ```
 */
export async function getBlockNumber(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
