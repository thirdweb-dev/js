import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getAdapter" function.
 */
export type GetAdapterParams = {
  adapterType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "adapterType";
  }>;
};

export const FN_SELECTOR = "0xd6cbae4d" as const;
const FN_INPUTS = [
  {
    type: "uint8",
    name: "adapterType",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    name: "adapterConfig",
    components: [
      {
        type: "bytes",
        name: "config",
      },
      {
        type: "address",
        name: "rewardLocker",
      },
    ],
  },
] as const;

/**
 * Checks if the `getAdapter` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAdapter` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isGetAdapterSupported } from "thirdweb/extensions/tokens";
 * const supported = isGetAdapterSupported(["0x..."]);
 * ```
 */
export function isGetAdapterSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAdapter" function.
 * @param options - The options for the getAdapter function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeGetAdapterParams } from "thirdweb/extensions/tokens";
 * const result = encodeGetAdapterParams({
 *  adapterType: ...,
 * });
 * ```
 */
export function encodeGetAdapterParams(options: GetAdapterParams) {
  return encodeAbiParameters(FN_INPUTS, [options.adapterType]);
}

/**
 * Encodes the "getAdapter" function into a Hex string with its parameters.
 * @param options - The options for the getAdapter function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeGetAdapter } from "thirdweb/extensions/tokens";
 * const result = encodeGetAdapter({
 *  adapterType: ...,
 * });
 * ```
 */
export function encodeGetAdapter(options: GetAdapterParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetAdapterParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getAdapter function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeGetAdapterResult } from "thirdweb/extensions/tokens";
 * const result = decodeGetAdapterResultResult("...");
 * ```
 */
export function decodeGetAdapterResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAdapter" function on the contract.
 * @param options - The options for the getAdapter function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getAdapter } from "thirdweb/extensions/tokens";
 *
 * const result = await getAdapter({
 *  contract,
 *  adapterType: ...,
 * });
 *
 * ```
 */
export async function getAdapter(
  options: BaseTransactionOptions<GetAdapterParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.adapterType],
  });
}
