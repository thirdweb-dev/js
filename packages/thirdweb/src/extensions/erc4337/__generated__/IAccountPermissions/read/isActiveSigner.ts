import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isActiveSigner" function.
 */
export type IsActiveSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0x7dff5a79" as const;
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
 * Encodes the parameters for the "isActiveSigner" function.
 * @param options - The options for the isActiveSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeIsActiveSignerParams } "thirdweb/extensions/erc4337";
 * const result = encodeIsActiveSignerParams({
 *  signer: ...,
 * });
 * ```
 */
export function encodeIsActiveSignerParams(options: IsActiveSignerParams) {
  return encodeAbiParameters(FN_INPUTS, [options.signer]);
}

/**
 * Decodes the result of the isActiveSigner function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeIsActiveSignerResult } from "thirdweb/extensions/erc4337";
 * const result = decodeIsActiveSignerResult("...");
 * ```
 */
export function decodeIsActiveSignerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isActiveSigner" function on the contract.
 * @param options - The options for the isActiveSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isActiveSigner } from "thirdweb/extensions/erc4337";
 *
 * const result = await isActiveSigner({
 *  signer: ...,
 * });
 *
 * ```
 */
export async function isActiveSigner(
  options: BaseTransactionOptions<IsActiveSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer],
  });
}
