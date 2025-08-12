import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "proposalVotes" function.
 */
export type ProposalVotesParams = {
  proposalId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proposalId";
  }>;
};

export const FN_SELECTOR = "0x544ffc9c" as const;
const FN_INPUTS = [
  {
    name: "proposalId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "againstVotes",
    type: "uint256",
  },
  {
    name: "forVotes",
    type: "uint256",
  },
  {
    name: "abstainVotes",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `proposalVotes` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `proposalVotes` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isProposalVotesSupported } from "thirdweb/extensions/vote";
 * const supported = isProposalVotesSupported(["0x..."]);
 * ```
 */
export function isProposalVotesSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "proposalVotes" function.
 * @param options - The options for the proposalVotes function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeProposalVotesParams } from "thirdweb/extensions/vote";
 * const result = encodeProposalVotesParams({
 *  proposalId: ...,
 * });
 * ```
 */
export function encodeProposalVotesParams(options: ProposalVotesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.proposalId]);
}

/**
 * Encodes the "proposalVotes" function into a Hex string with its parameters.
 * @param options - The options for the proposalVotes function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeProposalVotes } from "thirdweb/extensions/vote";
 * const result = encodeProposalVotes({
 *  proposalId: ...,
 * });
 * ```
 */
export function encodeProposalVotes(options: ProposalVotesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeProposalVotesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the proposalVotes function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeProposalVotesResult } from "thirdweb/extensions/vote";
 * const result = decodeProposalVotesResultResult("...");
 * ```
 */
export function decodeProposalVotesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "proposalVotes" function on the contract.
 * @param options - The options for the proposalVotes function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { proposalVotes } from "thirdweb/extensions/vote";
 *
 * const result = await proposalVotes({
 *  contract,
 *  proposalId: ...,
 * });
 *
 * ```
 */
export async function proposalVotes(
  options: BaseTransactionOptions<ProposalVotesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.proposalId],
  });
}
