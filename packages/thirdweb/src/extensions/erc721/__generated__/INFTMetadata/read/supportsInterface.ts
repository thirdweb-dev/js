import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "supportsInterface" function.
 */
export type SupportsInterfaceParams = {
  interfaceId: AbiParameterToPrimitiveType<{
    type: "bytes4";
    name: "interfaceId";
  }>;
};

export const FN_SELECTOR = "0x01ffc9a7" as const;
const FN_INPUTS = [
  {
    type: "bytes4",
    name: "interfaceId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Encodes the parameters for the "supportsInterface" function.
 * @param options - The options for the supportsInterface function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSupportsInterfaceParams } "thirdweb/extensions/erc721";
 * const result = encodeSupportsInterfaceParams({
 *  interfaceId: ...,
 * });
 * ```
 */
export function encodeSupportsInterfaceParams(
  options: SupportsInterfaceParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.interfaceId]);
}

/**
 * Decodes the result of the supportsInterface function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeSupportsInterfaceResult } from "thirdweb/extensions/erc721";
 * const result = decodeSupportsInterfaceResult("...");
 * ```
 */
export function decodeSupportsInterfaceResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "supportsInterface" function on the contract.
 * @param options - The options for the supportsInterface function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { supportsInterface } from "thirdweb/extensions/erc721";
 *
 * const result = await supportsInterface({
 *  interfaceId: ...,
 * });
 *
 * ```
 */
export async function supportsInterface(
  options: BaseTransactionOptions<SupportsInterfaceParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.interfaceId],
  });
}
