import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "supportsInterface" function.
 */
export type SupportsInterfaceParams = {
  interfaceId: AbiParameterToPrimitiveType<{
    type: "bytes4";
    name: "interfaceId";
  }>;
};

export const FN_SELECTOR = "0x01ffc9a7" as const;
const FN_INPUTS = [
  {
    type: "bytes4",
    name: "interfaceId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `supportsInterface` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `supportsInterface` method is supported.
 * @extension COMMON
 * @example
 * ```ts
 * import { isSupportsInterfaceSupported } from "thirdweb/extensions/common";
 *
 * const supported = await isSupportsInterfaceSupported(contract);
 * ```
 */
export async function isSupportsInterfaceSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "supportsInterface" function.
 * @param options - The options for the supportsInterface function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSupportsInterfaceParams } "thirdweb/extensions/common";
 * const result = encodeSupportsInterfaceParams({
 *  interfaceId: ...,
 * });
 * ```
 */
export function encodeSupportsInterfaceParams(
  options: SupportsInterfaceParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.interfaceId]);
}

/**
 * Encodes the "supportsInterface" function into a Hex string with its parameters.
 * @param options - The options for the supportsInterface function.
 * @returns The encoded hexadecimal string.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSupportsInterface } "thirdweb/extensions/common";
 * const result = encodeSupportsInterface({
 *  interfaceId: ...,
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
 * @extension COMMON
 * @example
 * ```ts
 * import { decodeSupportsInterfaceResult } from "thirdweb/extensions/common";
 * const result = decodeSupportsInterfaceResult("...");
 * ```
 */
export function decodeSupportsInterfaceResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "supportsInterface" function on the contract.
 * @param options - The options for the supportsInterface function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```ts
 * import { supportsInterface } from "thirdweb/extensions/common";
 *
 * const result = await supportsInterface({
 *  contract,
 *  interfaceId: ...,
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
    params: [options.interfaceId],
  });
}
