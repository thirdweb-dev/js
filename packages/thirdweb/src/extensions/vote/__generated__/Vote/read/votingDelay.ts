import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x3932abb1" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `votingDelay` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `votingDelay` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isVotingDelaySupported } from "thirdweb/extensions/vote";
 *
 * const supported = await isVotingDelaySupported(contract);
 * ```
 */
export async function isVotingDelaySupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the votingDelay function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeVotingDelayResult } from "thirdweb/extensions/vote";
 * const result = decodeVotingDelayResult("...");
 * ```
 */
export function decodeVotingDelayResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "votingDelay" function on the contract.
 * @param options - The options for the votingDelay function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { votingDelay } from "thirdweb/extensions/vote";
 *
 * const result = await votingDelay({
 *  contract,
 * });
 *
 * ```
 */
export async function votingDelay(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
