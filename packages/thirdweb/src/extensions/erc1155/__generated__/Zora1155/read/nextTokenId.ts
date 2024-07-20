import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x75794a3c" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `nextTokenId` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `nextTokenId` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isNextTokenIdSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = await isNextTokenIdSupported(contract);
 * ```
 */
export async function isNextTokenIdSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the nextTokenId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeNextTokenIdResult } from "thirdweb/extensions/erc1155";
 * const result = decodeNextTokenIdResult("...");
 * ```
 */
export function decodeNextTokenIdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "nextTokenId" function on the contract.
 * @param options - The options for the nextTokenId function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { nextTokenId } from "thirdweb/extensions/erc1155";
 *
 * const result = await nextTokenId({
 *  contract,
 * });
 *
 * ```
 */
export async function nextTokenId(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
