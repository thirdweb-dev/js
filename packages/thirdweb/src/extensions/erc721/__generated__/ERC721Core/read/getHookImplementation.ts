import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getHookImplementation" function.
 */
export type GetHookImplementationParams = {
  flag: AbiParameterToPrimitiveType<{
    name: "_flag";
    type: "uint256";
    internalType: "uint256";
  }>;
};

const FN_SELECTOR = "0x24077953" as const;
const FN_INPUTS = [
  {
    name: "_flag",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "address",
    internalType: "address",
  },
] as const;

/**
 * Encodes the parameters for the "getHookImplementation" function.
 * @param options - The options for the getHookImplementation function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeGetHookImplementationParams } "thirdweb/extensions/erc721";
 * const result = encodeGetHookImplementationParams({
 *  flag: ...,
 * });
 * ```
 */
export function encodeGetHookImplementationParams(
  options: GetHookImplementationParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.flag]);
}

/**
 * Decodes the result of the getHookImplementation function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeGetHookImplementationResult } from "thirdweb/extensions/erc721";
 * const result = decodeGetHookImplementationResult("...");
 * ```
 */
export function decodeGetHookImplementationResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getHookImplementation" function on the contract.
 * @param options - The options for the getHookImplementation function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { getHookImplementation } from "thirdweb/extensions/erc721";
 *
 * const result = await getHookImplementation({
 *  flag: ...,
 * });
 *
 * ```
 */
export async function getHookImplementation(
  options: BaseTransactionOptions<GetHookImplementationParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.flag],
  });
}
