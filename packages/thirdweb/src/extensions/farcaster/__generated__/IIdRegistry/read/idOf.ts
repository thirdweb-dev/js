import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "idOf" function.
 */
export type IdOfParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
};

export const FN_SELECTOR = "0xd94fe832" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "owner",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
] as const;

/**
 * Encodes the parameters for the "idOf" function.
 * @param options - The options for the idOf function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeIdOfParams } "thirdweb/extensions/farcaster";
 * const result = encodeIdOfParams({
 *  owner: ...,
 * });
 * ```
 */
export function encodeIdOfParams(options: IdOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owner]);
}

/**
 * Decodes the result of the idOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeIdOfResult } from "thirdweb/extensions/farcaster";
 * const result = decodeIdOfResult("...");
 * ```
 */
export function decodeIdOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "idOf" function on the contract.
 * @param options - The options for the idOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { idOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await idOf({
 *  owner: ...,
 * });
 *
 * ```
 */
export async function idOf(options: BaseTransactionOptions<IdOfParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner],
  });
}
