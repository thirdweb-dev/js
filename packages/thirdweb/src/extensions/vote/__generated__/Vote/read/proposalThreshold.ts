import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xb58131b0" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `proposalThreshold` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `proposalThreshold` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isProposalThresholdSupported } from "thirdweb/extensions/vote";
 * const supported = isProposalThresholdSupported(["0x..."]);
 * ```
 */
export function isProposalThresholdSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the proposalThreshold function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeProposalThresholdResult } from "thirdweb/extensions/vote";
 * const result = decodeProposalThresholdResultResult("...");
 * ```
 */
export function decodeProposalThresholdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "proposalThreshold" function on the contract.
 * @param options - The options for the proposalThreshold function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { proposalThreshold } from "thirdweb/extensions/vote";
 *
 * const result = await proposalThreshold({
 *  contract,
 * });
 *
 * ```
 */
export async function proposalThreshold(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
