import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xd25f82a0" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "airdrop",
  },
] as const;

/**
 * Checks if the `getAirdrop` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAirdrop` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isGetAirdropSupported } from "thirdweb/extensions/tokens";
 * const supported = isGetAirdropSupported(["0x..."]);
 * ```
 */
export function isGetAirdropSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getAirdrop function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeGetAirdropResult } from "thirdweb/extensions/tokens";
 * const result = decodeGetAirdropResultResult("...");
 * ```
 */
export function decodeGetAirdropResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAirdrop" function on the contract.
 * @param options - The options for the getAirdrop function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getAirdrop } from "thirdweb/extensions/tokens";
 *
 * const result = await getAirdrop({
 *  contract,
 * });
 *
 * ```
 */
export async function getAirdrop(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
