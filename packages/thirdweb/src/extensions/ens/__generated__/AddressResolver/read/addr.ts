import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "addr" function.
 */
export type AddrParams = {
  name: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "name" }>;
};

export const FN_SELECTOR = "0x3b3b57de" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "name",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Encodes the parameters for the "addr" function.
 * @param options - The options for the addr function.
 * @returns The encoded ABI parameters.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeAddrParams } "thirdweb/extensions/ens";
 * const result = encodeAddrParams({
 *  name: ...,
 * });
 * ```
 */
export function encodeAddrParams(options: AddrParams) {
  return encodeAbiParameters(FN_INPUTS, [options.name]);
}

/**
 * Decodes the result of the addr function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ENS
 * @example
 * ```ts
 * import { decodeAddrResult } from "thirdweb/extensions/ens";
 * const result = decodeAddrResult("...");
 * ```
 */
export function decodeAddrResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "addr" function on the contract.
 * @param options - The options for the addr function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```ts
 * import { addr } from "thirdweb/extensions/ens";
 *
 * const result = await addr({
 *  name: ...,
 * });
 *
 * ```
 */
export async function addr(options: BaseTransactionOptions<AddrParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.name],
  });
}
