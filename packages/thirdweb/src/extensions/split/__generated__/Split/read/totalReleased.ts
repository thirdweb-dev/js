import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xe33b7de3" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `totalReleased` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `totalReleased` method is supported.
 * @extension SPLIT
 * @example
 * ```ts
 * import { isTotalReleasedSupported } from "thirdweb/extensions/split";
 *
 * const supported = await isTotalReleasedSupported(contract);
 * ```
 */
export async function isTotalReleasedSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the totalReleased function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension SPLIT
 * @example
 * ```ts
 * import { decodeTotalReleasedResult } from "thirdweb/extensions/split";
 * const result = decodeTotalReleasedResult("...");
 * ```
 */
export function decodeTotalReleasedResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "totalReleased" function on the contract.
 * @param options - The options for the totalReleased function.
 * @returns The parsed result of the function call.
 * @extension SPLIT
 * @example
 * ```ts
 * import { totalReleased } from "thirdweb/extensions/split";
 *
 * const result = await totalReleased({
 *  contract,
 * });
 *
 * ```
 */
export async function totalReleased(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
