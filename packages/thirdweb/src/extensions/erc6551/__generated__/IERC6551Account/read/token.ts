import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xfc0c546a" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "chainId",
    type: "uint256",
  },
  {
    name: "tokenContract",
    type: "address",
  },
  {
    name: "tokenId",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `token` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `token` method is supported.
 * @extension ERC6551
 * @example
 * ```ts
 * import { isTokenSupported } from "thirdweb/extensions/erc6551";
 * const supported = isTokenSupported(["0x..."]);
 * ```
 */
export function isTokenSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the token function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC6551
 * @example
 * ```ts
 * import { decodeTokenResult } from "thirdweb/extensions/erc6551";
 * const result = decodeTokenResultResult("...");
 * ```
 */
export function decodeTokenResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "token" function on the contract.
 * @param options - The options for the token function.
 * @returns The parsed result of the function call.
 * @extension ERC6551
 * @example
 * ```ts
 * import { token } from "thirdweb/extensions/erc6551";
 *
 * const result = await token({
 *  contract,
 * });
 *
 * ```
 */
export async function token(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
