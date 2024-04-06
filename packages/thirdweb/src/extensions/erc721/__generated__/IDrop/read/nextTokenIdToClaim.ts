import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xacd083f8" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Decodes the result of the nextTokenIdToClaim function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeNextTokenIdToClaimResult } from "thirdweb/extensions/erc721";
 * const result = decodeNextTokenIdToClaimResult("...");
 * ```
 */
export function decodeNextTokenIdToClaimResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "nextTokenIdToClaim" function on the contract.
 * @param options - The options for the nextTokenIdToClaim function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { nextTokenIdToClaim } from "thirdweb/extensions/erc721";
 *
 * const result = await nextTokenIdToClaim();
 *
 * ```
 */
export async function nextTokenIdToClaim(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
