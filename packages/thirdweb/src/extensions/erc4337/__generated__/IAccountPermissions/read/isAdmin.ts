import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isAdmin" function.
 */
export type IsAdminParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0x24d7806c" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "signer",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Encodes the parameters for the "isAdmin" function.
 * @param options - The options for the isAdmin function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeIsAdminParams } "thirdweb/extensions/erc4337";
 * const result = encodeIsAdminParams({
 *  signer: ...,
 * });
 * ```
 */
export function encodeIsAdminParams(options: IsAdminParams) {
  return encodeAbiParameters(FN_INPUTS, [options.signer]);
}

/**
 * Decodes the result of the isAdmin function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeIsAdminResult } from "thirdweb/extensions/erc4337";
 * const result = decodeIsAdminResult("...");
 * ```
 */
export function decodeIsAdminResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isAdmin" function on the contract.
 * @param options - The options for the isAdmin function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isAdmin } from "thirdweb/extensions/erc4337";
 *
 * const result = await isAdmin({
 *  signer: ...,
 * });
 *
 * ```
 */
export async function isAdmin(options: BaseTransactionOptions<IsAdminParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer],
  });
}
