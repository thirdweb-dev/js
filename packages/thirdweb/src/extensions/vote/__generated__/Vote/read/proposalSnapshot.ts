import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "proposalSnapshot" function.
 */
export type ProposalSnapshotParams = {
  proposalId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proposalId";
  }>;
};

export const FN_SELECTOR = "0x2d63f693" as const;
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
 * Checks if the `proposalSnapshot` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `proposalSnapshot` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isProposalSnapshotSupported } from "thirdweb/extensions/vote";
 * const supported = isProposalSnapshotSupported(["0x..."]);
 * ```
 */
export function isProposalSnapshotSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "proposalSnapshot" function.
 * @param options - The options for the proposalSnapshot function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeProposalSnapshotParams } from "thirdweb/extensions/vote";
 * const result = encodeProposalSnapshotParams({
 *  proposalId: ...,
 * });
 * ```
 */
export function encodeProposalSnapshotParams(options: ProposalSnapshotParams) {
  return encodeAbiParameters(FN_INPUTS, [options.proposalId]);
}

/**
 * Encodes the "proposalSnapshot" function into a Hex string with its parameters.
 * @param options - The options for the proposalSnapshot function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeProposalSnapshot } from "thirdweb/extensions/vote";
 * const result = encodeProposalSnapshot({
 *  proposalId: ...,
 * });
 * ```
 */
export function encodeProposalSnapshot(options: ProposalSnapshotParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeProposalSnapshotParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the proposalSnapshot function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeProposalSnapshotResult } from "thirdweb/extensions/vote";
 * const result = decodeProposalSnapshotResultResult("...");
 * ```
 */
export function decodeProposalSnapshotResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "proposalSnapshot" function on the contract.
 * @param options - The options for the proposalSnapshot function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { proposalSnapshot } from "thirdweb/extensions/vote";
 *
 * const result = await proposalSnapshot({
 *  contract,
 *  proposalId: ...,
 * });
 *
 * ```
 */
export async function proposalSnapshot(
  options: BaseTransactionOptions<ProposalSnapshotParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.proposalId],
  });
}
