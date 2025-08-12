import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getOriginalFollowTimestamp" function.
 */
export type GetOriginalFollowTimestampParams = {
  followTokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "followTokenId";
  }>;
};

export const FN_SELECTOR = "0xd1b34934" as const;
const FN_INPUTS = [
  {
    name: "followTokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getOriginalFollowTimestamp` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getOriginalFollowTimestamp` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetOriginalFollowTimestampSupported } from "thirdweb/extensions/lens";
 * const supported = isGetOriginalFollowTimestampSupported(["0x..."]);
 * ```
 */
export function isGetOriginalFollowTimestampSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getOriginalFollowTimestamp" function.
 * @param options - The options for the getOriginalFollowTimestamp function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetOriginalFollowTimestampParams } from "thirdweb/extensions/lens";
 * const result = encodeGetOriginalFollowTimestampParams({
 *  followTokenId: ...,
 * });
 * ```
 */
export function encodeGetOriginalFollowTimestampParams(
  options: GetOriginalFollowTimestampParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.followTokenId]);
}

/**
 * Encodes the "getOriginalFollowTimestamp" function into a Hex string with its parameters.
 * @param options - The options for the getOriginalFollowTimestamp function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetOriginalFollowTimestamp } from "thirdweb/extensions/lens";
 * const result = encodeGetOriginalFollowTimestamp({
 *  followTokenId: ...,
 * });
 * ```
 */
export function encodeGetOriginalFollowTimestamp(
  options: GetOriginalFollowTimestampParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetOriginalFollowTimestampParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getOriginalFollowTimestamp function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetOriginalFollowTimestampResult } from "thirdweb/extensions/lens";
 * const result = decodeGetOriginalFollowTimestampResultResult("...");
 * ```
 */
export function decodeGetOriginalFollowTimestampResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getOriginalFollowTimestamp" function on the contract.
 * @param options - The options for the getOriginalFollowTimestamp function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getOriginalFollowTimestamp } from "thirdweb/extensions/lens";
 *
 * const result = await getOriginalFollowTimestamp({
 *  contract,
 *  followTokenId: ...,
 * });
 *
 * ```
 */
export async function getOriginalFollowTimestamp(
  options: BaseTransactionOptions<GetOriginalFollowTimestampParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.followTokenId],
  });
}
