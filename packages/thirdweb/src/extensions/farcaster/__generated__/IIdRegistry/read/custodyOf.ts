import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "custodyOf" function.
 */
export type CustodyOfParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
};

export const FN_SELECTOR = "0x65269e47" as const;
const FN_INPUTS = [
  {
    name: "fid",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "owner",
    type: "address",
  },
] as const;

/**
 * Checks if the `custodyOf` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `custodyOf` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isCustodyOfSupported } from "thirdweb/extensions/farcaster";
 * const supported = isCustodyOfSupported(["0x..."]);
 * ```
 */
export function isCustodyOfSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "custodyOf" function.
 * @param options - The options for the custodyOf function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeCustodyOfParams } from "thirdweb/extensions/farcaster";
 * const result = encodeCustodyOfParams({
 *  fid: ...,
 * });
 * ```
 */
export function encodeCustodyOfParams(options: CustodyOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid]);
}

/**
 * Encodes the "custodyOf" function into a Hex string with its parameters.
 * @param options - The options for the custodyOf function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeCustodyOf } from "thirdweb/extensions/farcaster";
 * const result = encodeCustodyOf({
 *  fid: ...,
 * });
 * ```
 */
export function encodeCustodyOf(options: CustodyOfParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCustodyOfParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the custodyOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeCustodyOfResult } from "thirdweb/extensions/farcaster";
 * const result = decodeCustodyOfResultResult("...");
 * ```
 */
export function decodeCustodyOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "custodyOf" function on the contract.
 * @param options - The options for the custodyOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { custodyOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await custodyOf({
 *  contract,
 *  fid: ...,
 * });
 *
 * ```
 */
export async function custodyOf(
  options: BaseTransactionOptions<CustodyOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.fid],
  });
}
