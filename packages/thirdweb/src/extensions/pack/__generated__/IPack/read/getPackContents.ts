import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getPackContents" function.
 */
export type GetPackContentsParams = {
  packId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_packId" }>;
};

export const FN_SELECTOR = "0x8d4c446a" as const;
const FN_INPUTS = [
  {
    name: "_packId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "assetContract",
        type: "address",
      },
      {
        name: "tokenType",
        type: "uint8",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "totalAmount",
        type: "uint256",
      },
    ],
    name: "contents",
    type: "tuple[]",
  },
  {
    name: "perUnitAmounts",
    type: "uint256[]",
  },
] as const;

/**
 * Checks if the `getPackContents` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getPackContents` method is supported.
 * @extension PACK
 * @example
 * ```ts
 * import { isGetPackContentsSupported } from "thirdweb/extensions/pack";
 * const supported = isGetPackContentsSupported(["0x..."]);
 * ```
 */
export function isGetPackContentsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getPackContents" function.
 * @param options - The options for the getPackContents function.
 * @returns The encoded ABI parameters.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetPackContentsParams } from "thirdweb/extensions/pack";
 * const result = encodeGetPackContentsParams({
 *  packId: ...,
 * });
 * ```
 */
export function encodeGetPackContentsParams(options: GetPackContentsParams) {
  return encodeAbiParameters(FN_INPUTS, [options.packId]);
}

/**
 * Encodes the "getPackContents" function into a Hex string with its parameters.
 * @param options - The options for the getPackContents function.
 * @returns The encoded hexadecimal string.
 * @extension PACK
 * @example
 * ```ts
 * import { encodeGetPackContents } from "thirdweb/extensions/pack";
 * const result = encodeGetPackContents({
 *  packId: ...,
 * });
 * ```
 */
export function encodeGetPackContents(options: GetPackContentsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetPackContentsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getPackContents function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension PACK
 * @example
 * ```ts
 * import { decodeGetPackContentsResult } from "thirdweb/extensions/pack";
 * const result = decodeGetPackContentsResultResult("...");
 * ```
 */
export function decodeGetPackContentsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getPackContents" function on the contract.
 * @param options - The options for the getPackContents function.
 * @returns The parsed result of the function call.
 * @extension PACK
 * @example
 * ```ts
 * import { getPackContents } from "thirdweb/extensions/pack";
 *
 * const result = await getPackContents({
 *  contract,
 *  packId: ...,
 * });
 *
 * ```
 */
export async function getPackContents(
  options: BaseTransactionOptions<GetPackContentsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.packId],
  });
}
