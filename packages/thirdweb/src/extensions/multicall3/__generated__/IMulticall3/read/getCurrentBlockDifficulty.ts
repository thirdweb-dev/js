import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x72425d9d" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    internalType: "uint256",
    name: "difficulty",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getCurrentBlockDifficulty` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getCurrentBlockDifficulty` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isGetCurrentBlockDifficultySupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isGetCurrentBlockDifficultySupported(contract);
 * ```
 */
export async function isGetCurrentBlockDifficultySupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getCurrentBlockDifficulty function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { decodeGetCurrentBlockDifficultyResult } from "thirdweb/extensions/multicall3";
 * const result = decodeGetCurrentBlockDifficultyResult("...");
 * ```
 */
export function decodeGetCurrentBlockDifficultyResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getCurrentBlockDifficulty" function on the contract.
 * @param options - The options for the getCurrentBlockDifficulty function.
 * @returns The parsed result of the function call.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { getCurrentBlockDifficulty } from "thirdweb/extensions/multicall3";
 *
 * const result = await getCurrentBlockDifficulty({
 *  contract,
 * });
 *
 * ```
 */
export async function getCurrentBlockDifficulty(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
