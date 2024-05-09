import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xa8b0574e" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    internalType: "address",
    name: "coinbase",
    type: "address",
  },
] as const;

/**
 * Checks if the `getCurrentBlockCoinbase` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getCurrentBlockCoinbase` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isGetCurrentBlockCoinbaseSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isGetCurrentBlockCoinbaseSupported(contract);
 * ```
 */
export async function isGetCurrentBlockCoinbaseSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getCurrentBlockCoinbase function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { decodeGetCurrentBlockCoinbaseResult } from "thirdweb/extensions/multicall3";
 * const result = decodeGetCurrentBlockCoinbaseResult("...");
 * ```
 */
export function decodeGetCurrentBlockCoinbaseResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getCurrentBlockCoinbase" function on the contract.
 * @param options - The options for the getCurrentBlockCoinbase function.
 * @returns The parsed result of the function call.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { getCurrentBlockCoinbase } from "thirdweb/extensions/multicall3";
 *
 * const result = await getCurrentBlockCoinbase({
 *  contract,
 * });
 *
 * ```
 */
export async function getCurrentBlockCoinbase(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
