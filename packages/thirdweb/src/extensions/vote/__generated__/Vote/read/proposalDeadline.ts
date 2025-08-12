import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "proposalDeadline" function.
 */
export type ProposalDeadlineParams = {
  proposalId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proposalId";
  }>;
};

export const FN_SELECTOR = "0xc01f9e37" as const;
const FN_INPUTS = [
  {
    name: "proposalId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `proposalDeadline` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `proposalDeadline` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isProposalDeadlineSupported } from "thirdweb/extensions/vote";
 * const supported = isProposalDeadlineSupported(["0x..."]);
 * ```
 */
export function isProposalDeadlineSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "proposalDeadline" function.
 * @param options - The options for the proposalDeadline function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeProposalDeadlineParams } from "thirdweb/extensions/vote";
 * const result = encodeProposalDeadlineParams({
 *  proposalId: ...,
 * });
 * ```
 */
export function encodeProposalDeadlineParams(options: ProposalDeadlineParams) {
  return encodeAbiParameters(FN_INPUTS, [options.proposalId]);
}

/**
 * Encodes the "proposalDeadline" function into a Hex string with its parameters.
 * @param options - The options for the proposalDeadline function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeProposalDeadline } from "thirdweb/extensions/vote";
 * const result = encodeProposalDeadline({
 *  proposalId: ...,
 * });
 * ```
 */
export function encodeProposalDeadline(options: ProposalDeadlineParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeProposalDeadlineParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the proposalDeadline function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeProposalDeadlineResult } from "thirdweb/extensions/vote";
 * const result = decodeProposalDeadlineResultResult("...");
 * ```
 */
export function decodeProposalDeadlineResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "proposalDeadline" function on the contract.
 * @param options - The options for the proposalDeadline function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { proposalDeadline } from "thirdweb/extensions/vote";
 *
 * const result = await proposalDeadline({
 *  contract,
 *  proposalId: ...,
 * });
 *
 * ```
 */
export async function proposalDeadline(
  options: BaseTransactionOptions<ProposalDeadlineParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.proposalId],
  });
}
