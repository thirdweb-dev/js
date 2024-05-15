import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getAddress" function.
 */
export type GetAddressParams = {
  adminSigner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "adminSigner";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
};

export const FN_SELECTOR = "0x8878ed33" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "adminSigner",
  },
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `getAddress` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getAddress` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetAddressSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isGetAddressSupported(contract);
 * ```
 */
export async function isGetAddressSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAddress" function.
 * @param options - The options for the getAddress function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetAddressParams } "thirdweb/extensions/erc4337";
 * const result = encodeGetAddressParams({
 *  adminSigner: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeGetAddressParams(options: GetAddressParams) {
  return encodeAbiParameters(FN_INPUTS, [options.adminSigner, options.data]);
}

/**
 * Encodes the "getAddress" function into a Hex string with its parameters.
 * @param options - The options for the getAddress function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetAddress } "thirdweb/extensions/erc4337";
 * const result = encodeGetAddress({
 *  adminSigner: ...,
 *  data: ...,
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
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeGetAddressResult } from "thirdweb/extensions/erc4337";
 * const result = decodeGetAddressResult("...");
 * ```
 */
export function decodeGetAddressResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAddress" function on the contract.
 * @param options - The options for the getAddress function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getAddress } from "thirdweb/extensions/erc4337";
 *
 * const result = await getAddress({
 *  contract,
 *  adminSigner: ...,
 *  data: ...,
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
    params: [options.adminSigner, options.data],
  });
}
