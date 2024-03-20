import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

const FN_SELECTOR = "0xa2309ff8" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Decodes the result of the totalMinted function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```
 * import { decodeTotalMintedResult } from "thirdweb/extensions/erc721";
 * const result = decodeTotalMintedResult("...");
 * ```
 */
export function decodeTotalMintedResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "totalMinted" function on the contract.
 * @param options - The options for the totalMinted function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { totalMinted } from "thirdweb/extensions/erc721";
 *
 * const result = await totalMinted();
 *
 * ```
 */
export async function totalMinted(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
