import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getAddress" function.
 */
export type GetAddressParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  salt: AbiParameterToPrimitiveType<{ type: "bytes"; name: "salt" }>;
};

export const FN_SELECTOR = "0x8878ed33" as const;
const FN_INPUTS = [
  {
    name: "owner",
    type: "address",
  },
  {
    name: "salt",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "account",
    type: "address",
  },
] as const;

/**
 * Checks if the `getAddress` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAddress` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isGetAddressSupported } from "thirdweb/extensions/erc7579";
 * const supported = isGetAddressSupported(["0x..."]);
 * ```
 */
export function isGetAddressSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAddress" function.
 * @param options - The options for the getAddress function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeGetAddressParams } from "thirdweb/extensions/erc7579";
 * const result = encodeGetAddressParams({
 *  owner: ...,
 *  salt: ...,
 * });
 * ```
 */
export function encodeGetAddressParams(options: GetAddressParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owner, options.salt]);
}

/**
 * Encodes the "getAddress" function into a Hex string with its parameters.
 * @param options - The options for the getAddress function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeGetAddress } from "thirdweb/extensions/erc7579";
 * const result = encodeGetAddress({
 *  owner: ...,
 *  salt: ...,
 * });
 * ```
 */
export function encodeGetAddress(options: GetAddressParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetAddressParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getAddress function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeGetAddressResult } from "thirdweb/extensions/erc7579";
 * const result = decodeGetAddressResultResult("...");
 * ```
 */
export function decodeGetAddressResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAddress" function on the contract.
 * @param options - The options for the getAddress function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { getAddress } from "thirdweb/extensions/erc7579";
 *
 * const result = await getAddress({
 *  contract,
 *  owner: ...,
 *  salt: ...,
 * });
 *
 * ```
 */
export async function getAddress(
  options: BaseTransactionOptions<GetAddressParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner, options.salt],
  });
}
