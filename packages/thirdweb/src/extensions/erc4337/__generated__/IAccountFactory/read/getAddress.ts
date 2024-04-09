import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

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
