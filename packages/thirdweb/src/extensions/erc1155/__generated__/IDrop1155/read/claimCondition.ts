import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "claimCondition" function.
 */
export type ClaimConditionParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
};

export const FN_SELECTOR = "0xe9703d25" as const;
const FN_INPUTS = [
  {
    name: "_tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "currentStartId",
    type: "uint256",
  },
  {
    name: "count",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `claimCondition` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `claimCondition` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isClaimConditionSupported } from "thirdweb/extensions/erc1155";
 * const supported = isClaimConditionSupported(["0x..."]);
 * ```
 */
export function isClaimConditionSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "claimCondition" function.
 * @param options - The options for the claimCondition function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeClaimConditionParams } from "thirdweb/extensions/erc1155";
 * const result = encodeClaimConditionParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeClaimConditionParams(options: ClaimConditionParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "claimCondition" function into a Hex string with its parameters.
 * @param options - The options for the claimCondition function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeClaimCondition } from "thirdweb/extensions/erc1155";
 * const result = encodeClaimCondition({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeClaimCondition(options: ClaimConditionParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeClaimConditionParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the claimCondition function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeClaimConditionResult } from "thirdweb/extensions/erc1155";
 * const result = decodeClaimConditionResultResult("...");
 * ```
 */
export function decodeClaimConditionResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "claimCondition" function on the contract.
 * @param options - The options for the claimCondition function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { claimCondition } from "thirdweb/extensions/erc1155";
 *
 * const result = await claimCondition({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function claimCondition(
  options: BaseTransactionOptions<ClaimConditionParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
