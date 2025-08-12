import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xb280f703" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "name",
    type: "string",
  },
  {
    name: "description",
    type: "string",
  },
  {
    name: "imageURI",
    type: "string",
  },
  {
    name: "animationURI",
    type: "string",
  },
] as const;

/**
 * Checks if the `sharedMetadata` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `sharedMetadata` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isSharedMetadataSupported } from "thirdweb/extensions/erc721";
 * const supported = isSharedMetadataSupported(["0x..."]);
 * ```
 */
export function isSharedMetadataSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the sharedMetadata function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeSharedMetadataResult } from "thirdweb/extensions/erc721";
 * const result = decodeSharedMetadataResultResult("...");
 * ```
 */
export function decodeSharedMetadataResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "sharedMetadata" function on the contract.
 * @param options - The options for the sharedMetadata function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { sharedMetadata } from "thirdweb/extensions/erc721";
 *
 * const result = await sharedMetadata({
 *  contract,
 * });
 *
 * ```
 */
export async function sharedMetadata(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
