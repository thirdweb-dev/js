import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x99ba5936" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `ROLE_FEE_MANAGER` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `ROLE_FEE_MANAGER` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isROLE_FEE_MANAGERSupported } from "thirdweb/extensions/tokens";
 * const supported = isROLE_FEE_MANAGERSupported(["0x..."]);
 * ```
 */
export function isROLE_FEE_MANAGERSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the ROLE_FEE_MANAGER function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeROLE_FEE_MANAGERResult } from "thirdweb/extensions/tokens";
 * const result = decodeROLE_FEE_MANAGERResultResult("...");
 * ```
 */
export function decodeROLE_FEE_MANAGERResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "ROLE_FEE_MANAGER" function on the contract.
 * @param options - The options for the ROLE_FEE_MANAGER function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { ROLE_FEE_MANAGER } from "thirdweb/extensions/tokens";
 *
 * const result = await ROLE_FEE_MANAGER({
 *  contract,
 * });
 *
 * ```
 */
export async function ROLE_FEE_MANAGER(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
