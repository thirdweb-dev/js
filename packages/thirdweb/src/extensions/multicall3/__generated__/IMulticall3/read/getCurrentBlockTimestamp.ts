import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x0f28c97d" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    internalType: "uint256",
    name: "timestamp",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getCurrentBlockTimestamp` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getCurrentBlockTimestamp` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isGetCurrentBlockTimestampSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isGetCurrentBlockTimestampSupported(contract);
 * ```
 */
export async function isGetCurrentBlockTimestampSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getCurrentBlockTimestamp function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { decodeGetCurrentBlockTimestampResult } from "thirdweb/extensions/multicall3";
 * const result = decodeGetCurrentBlockTimestampResult("...");
 * ```
 */
export function decodeGetCurrentBlockTimestampResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getCurrentBlockTimestamp" function on the contract.
 * @param options - The options for the getCurrentBlockTimestamp function.
 * @returns The parsed result of the function call.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { getCurrentBlockTimestamp } from "thirdweb/extensions/multicall3";
 *
 * const result = await getCurrentBlockTimestamp({
 *  contract,
 * });
 *
 * ```
 */
export async function getCurrentBlockTimestamp(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
