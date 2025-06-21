import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x27e86d6e" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "blockHash",
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `getLastBlockHash` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getLastBlockHash` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isGetLastBlockHashSupported } from "thirdweb/extensions/multicall3";
 * const supported = isGetLastBlockHashSupported(["0x..."]);
 * ```
 */
export function isGetLastBlockHashSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getLastBlockHash function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { decodeGetLastBlockHashResult } from "thirdweb/extensions/multicall3";
 * const result = decodeGetLastBlockHashResultResult("...");
 * ```
 */
export function decodeGetLastBlockHashResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getLastBlockHash" function on the contract.
 * @param options - The options for the getLastBlockHash function.
 * @returns The parsed result of the function call.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { getLastBlockHash } from "thirdweb/extensions/multicall3";
 *
 * const result = await getLastBlockHash({
 *  contract,
 * });
 *
 * ```
 */
export async function getLastBlockHash(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
