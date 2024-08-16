import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x02a251a3" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `votingPeriod` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `votingPeriod` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isVotingPeriodSupported } from "thirdweb/extensions/vote";
 *
 * const supported = await isVotingPeriodSupported(contract);
 * ```
 */
export async function isVotingPeriodSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the votingPeriod function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeVotingPeriodResult } from "thirdweb/extensions/vote";
 * const result = decodeVotingPeriodResult("...");
 * ```
 */
export function decodeVotingPeriodResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "votingPeriod" function on the contract.
 * @param options - The options for the votingPeriod function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { votingPeriod } from "thirdweb/extensions/vote";
 *
 * const result = await votingPeriod({
 *  contract,
 * });
 *
 * ```
 */
export async function votingPeriod(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
