import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "supportsInterface" function.
 */
export type SupportsInterfaceParams = {
  interfaceID: AbiParameterToPrimitiveType<{
    type: "bytes4";
    name: "interfaceID";
  }>;
};

export const FN_SELECTOR = "0x01ffc9a7" as const;
const FN_INPUTS = [
  {
    name: "interfaceID",
    type: "bytes4",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `supportsInterface` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `supportsInterface` method is supported.
 * @extension MODULES
 * @example
 * ```ts
 * import { isSupportsInterfaceSupported } from "thirdweb/extensions/modules";
 * const supported = isSupportsInterfaceSupported(["0x..."]);
 * ```
 */
export function isSupportsInterfaceSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "supportsInterface" function.
 * @param options - The options for the supportsInterface function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeSupportsInterfaceParams } from "thirdweb/extensions/modules";
 * const result = encodeSupportsInterfaceParams({
 *  interfaceID: ...,
 * });
 * ```
 */
export function encodeSupportsInterfaceParams(
  options: SupportsInterfaceParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.interfaceID]);
}

/**
 * Encodes the "supportsInterface" function into a Hex string with its parameters.
 * @param options - The options for the supportsInterface function.
 * @returns The encoded hexadecimal string.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeSupportsInterface } from "thirdweb/extensions/modules";
 * const result = encodeSupportsInterface({
 *  interfaceID: ...,
 * });
 * ```
 */
export function encodeSupportsInterface(options: SupportsInterfaceParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSupportsInterfaceParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the supportsInterface function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULES
 * @example
 * ```ts
 * import { decodeSupportsInterfaceResult } from "thirdweb/extensions/modules";
 * const result = decodeSupportsInterfaceResultResult("...");
 * ```
 */
export function decodeSupportsInterfaceResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "supportsInterface" function on the contract.
 * @param options - The options for the supportsInterface function.
 * @returns The parsed result of the function call.
 * @extension MODULES
 * @example
 * ```ts
 * import { supportsInterface } from "thirdweb/extensions/modules";
 *
 * const result = await supportsInterface({
 *  contract,
 *  interfaceID: ...,
 * });
 *
 * ```
 */
export async function supportsInterface(
  options: BaseTransactionOptions<SupportsInterfaceParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.interfaceID],
  });
}
