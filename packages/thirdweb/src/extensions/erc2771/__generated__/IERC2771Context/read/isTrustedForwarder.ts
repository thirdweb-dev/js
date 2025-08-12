import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isTrustedForwarder" function.
 */
export type IsTrustedForwarderParams = {
  forwarder: AbiParameterToPrimitiveType<{
    type: "address";
    name: "forwarder";
  }>;
};

export const FN_SELECTOR = "0x572b6c05" as const;
const FN_INPUTS = [
  {
    name: "forwarder",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isTrustedForwarder` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isTrustedForwarder` method is supported.
 * @extension ERC2771
 * @example
 * ```ts
 * import { isIsTrustedForwarderSupported } from "thirdweb/extensions/erc2771";
 * const supported = isIsTrustedForwarderSupported(["0x..."]);
 * ```
 */
export function isIsTrustedForwarderSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isTrustedForwarder" function.
 * @param options - The options for the isTrustedForwarder function.
 * @returns The encoded ABI parameters.
 * @extension ERC2771
 * @example
 * ```ts
 * import { encodeIsTrustedForwarderParams } from "thirdweb/extensions/erc2771";
 * const result = encodeIsTrustedForwarderParams({
 *  forwarder: ...,
 * });
 * ```
 */
export function encodeIsTrustedForwarderParams(
  options: IsTrustedForwarderParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.forwarder]);
}

/**
 * Encodes the "isTrustedForwarder" function into a Hex string with its parameters.
 * @param options - The options for the isTrustedForwarder function.
 * @returns The encoded hexadecimal string.
 * @extension ERC2771
 * @example
 * ```ts
 * import { encodeIsTrustedForwarder } from "thirdweb/extensions/erc2771";
 * const result = encodeIsTrustedForwarder({
 *  forwarder: ...,
 * });
 * ```
 */
export function encodeIsTrustedForwarder(options: IsTrustedForwarderParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsTrustedForwarderParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isTrustedForwarder function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC2771
 * @example
 * ```ts
 * import { decodeIsTrustedForwarderResult } from "thirdweb/extensions/erc2771";
 * const result = decodeIsTrustedForwarderResultResult("...");
 * ```
 */
export function decodeIsTrustedForwarderResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isTrustedForwarder" function on the contract.
 * @param options - The options for the isTrustedForwarder function.
 * @returns The parsed result of the function call.
 * @extension ERC2771
 * @example
 * ```ts
 * import { isTrustedForwarder } from "thirdweb/extensions/erc2771";
 *
 * const result = await isTrustedForwarder({
 *  contract,
 *  forwarder: ...,
 * });
 *
 * ```
 */
export async function isTrustedForwarder(
  options: BaseTransactionOptions<IsTrustedForwarderParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.forwarder],
  });
}
