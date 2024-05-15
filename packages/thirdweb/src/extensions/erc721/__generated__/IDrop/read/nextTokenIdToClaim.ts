import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xacd083f8" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `nextTokenIdToClaim` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `nextTokenIdToClaim` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isNextTokenIdToClaimSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isNextTokenIdToClaimSupported(contract);
 * ```
 */
export async function isNextTokenIdToClaimSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

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
 * const result = await nextTokenIdToClaim({
 *  contract,
 * });
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
