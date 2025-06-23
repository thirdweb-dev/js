import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "proposals" function.
 */
export type ProposalsParams = {
  key: AbiParameterToPrimitiveType<{ type: "uint256"; name: "key" }>;
};

export const FN_SELECTOR = "0x013cf08b" as const;
const FN_INPUTS = [
  {
    name: "key",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "proposalId",
    type: "uint256",
  },
  {
    name: "proposer",
    type: "address",
  },
  {
    name: "startBlock",
    type: "uint256",
  },
  {
    name: "endBlock",
    type: "uint256",
  },
  {
    name: "description",
    type: "string",
  },
] as const;

/**
 * Checks if the `proposals` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `proposals` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isProposalsSupported } from "thirdweb/extensions/vote";
 * const supported = isProposalsSupported(["0x..."]);
 * ```
 */
export function isProposalsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "proposals" function.
 * @param options - The options for the proposals function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeProposalsParams } from "thirdweb/extensions/vote";
 * const result = encodeProposalsParams({
 *  key: ...,
 * });
 * ```
 */
export function encodeProposalsParams(options: ProposalsParams) {
  return encodeAbiParameters(FN_INPUTS, [options.key]);
}

/**
 * Encodes the "proposals" function into a Hex string with its parameters.
 * @param options - The options for the proposals function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeProposals } from "thirdweb/extensions/vote";
 * const result = encodeProposals({
 *  key: ...,
 * });
 * ```
 */
export function encodeProposals(options: ProposalsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeProposalsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the proposals function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeProposalsResult } from "thirdweb/extensions/vote";
 * const result = decodeProposalsResultResult("...");
 * ```
 */
export function decodeProposalsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "proposals" function on the contract.
 * @param options - The options for the proposals function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { proposals } from "thirdweb/extensions/vote";
 *
 * const result = await proposals({
 *  contract,
 *  key: ...,
 * });
 *
 * ```
 */
export async function proposals(
  options: BaseTransactionOptions<ProposalsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.key],
  });
}
