import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "pubkey" function.
 */
export type PubkeyParams = {
  name: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "name" }>;
};

export const FN_SELECTOR = "0xc8690233" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "name",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
    name: "x",
  },
  {
    type: "bytes32",
    name: "y",
  },
] as const;

/**
 * Encodes the parameters for the "pubkey" function.
 * @param options - The options for the pubkey function.
 * @returns The encoded ABI parameters.
 * @extension ENS
 * @example
 * ```ts
 * import { encodePubkeyParams } "thirdweb/extensions/ens";
 * const result = encodePubkeyParams({
 *  name: ...,
 * });
 * ```
 */
export function encodePubkeyParams(options: PubkeyParams) {
  return encodeAbiParameters(FN_INPUTS, [options.name]);
}

/**
 * Decodes the result of the pubkey function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ENS
 * @example
 * ```ts
 * import { decodePubkeyResult } from "thirdweb/extensions/ens";
 * const result = decodePubkeyResult("...");
 * ```
 */
export function decodePubkeyResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "pubkey" function on the contract.
 * @param options - The options for the pubkey function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```ts
 * import { pubkey } from "thirdweb/extensions/ens";
 *
 * const result = await pubkey({
 *  name: ...,
 * });
 *
 * ```
 */
export async function pubkey(options: BaseTransactionOptions<PubkeyParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.name],
  });
}
