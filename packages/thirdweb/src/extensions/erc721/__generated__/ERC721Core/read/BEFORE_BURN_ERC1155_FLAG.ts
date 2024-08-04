import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

const FN_SELECTOR = "0xc42ed21c" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Decodes the result of the BEFORE_BURN_ERC1155_FLAG function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeBEFORE_BURN_ERC1155_FLAGResult } from "thirdweb/extensions/erc721";
 * const result = decodeBEFORE_BURN_ERC1155_FLAGResult("...");
 * ```
 */
export function decodeBEFORE_BURN_ERC1155_FLAGResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "BEFORE_BURN_ERC1155_FLAG" function on the contract.
 * @param options - The options for the BEFORE_BURN_ERC1155_FLAG function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { BEFORE_BURN_ERC1155_FLAG } from "thirdweb/extensions/erc721";
 *
 * const result = await BEFORE_BURN_ERC1155_FLAG();
 *
 * ```
 */
export async function BEFORE_BURN_ERC1155_FLAG(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
