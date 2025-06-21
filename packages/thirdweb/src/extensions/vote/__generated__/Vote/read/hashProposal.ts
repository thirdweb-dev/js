import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "hashProposal" function.
 */
export type HashProposalParams = {
  targets: AbiParameterToPrimitiveType<{ type: "address[]"; name: "targets" }>;
  values: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "values" }>;
  calldatas: AbiParameterToPrimitiveType<{
    type: "bytes[]";
    name: "calldatas";
  }>;
  descriptionHash: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "descriptionHash";
  }>;
};

export const FN_SELECTOR = "0xc59057e4" as const;
const FN_INPUTS = [
  {
    name: "targets",
    type: "address[]",
  },
  {
    name: "values",
    type: "uint256[]",
  },
  {
    name: "calldatas",
    type: "bytes[]",
  },
  {
    name: "descriptionHash",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `hashProposal` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `hashProposal` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isHashProposalSupported } from "thirdweb/extensions/vote";
 * const supported = isHashProposalSupported(["0x..."]);
 * ```
 */
export function isHashProposalSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "hashProposal" function.
 * @param options - The options for the hashProposal function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeHashProposalParams } from "thirdweb/extensions/vote";
 * const result = encodeHashProposalParams({
 *  targets: ...,
 *  values: ...,
 *  calldatas: ...,
 *  descriptionHash: ...,
 * });
 * ```
 */
export function encodeHashProposalParams(options: HashProposalParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.targets,
    options.values,
    options.calldatas,
    options.descriptionHash,
  ]);
}

/**
 * Encodes the "hashProposal" function into a Hex string with its parameters.
 * @param options - The options for the hashProposal function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeHashProposal } from "thirdweb/extensions/vote";
 * const result = encodeHashProposal({
 *  targets: ...,
 *  values: ...,
 *  calldatas: ...,
 *  descriptionHash: ...,
 * });
 * ```
 */
export function encodeHashProposal(options: HashProposalParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeHashProposalParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the hashProposal function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeHashProposalResult } from "thirdweb/extensions/vote";
 * const result = decodeHashProposalResultResult("...");
 * ```
 */
export function decodeHashProposalResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "hashProposal" function on the contract.
 * @param options - The options for the hashProposal function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { hashProposal } from "thirdweb/extensions/vote";
 *
 * const result = await hashProposal({
 *  contract,
 *  targets: ...,
 *  values: ...,
 *  calldatas: ...,
 *  descriptionHash: ...,
 * });
 *
 * ```
 */
export async function hashProposal(
  options: BaseTransactionOptions<HashProposalParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [
      options.targets,
      options.values,
      options.calldatas,
      options.descriptionHash,
    ],
  });
}
