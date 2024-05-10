import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xa9fd8ed1" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `totalOffers` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `totalOffers` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isTotalOffersSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isTotalOffersSupported(contract);
 * ```
 */
export async function isTotalOffersSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the totalOffers function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeTotalOffersResult } from "thirdweb/extensions/marketplace";
 * const result = decodeTotalOffersResult("...");
 * ```
 */
export function decodeTotalOffersResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "totalOffers" function on the contract.
 * @param options - The options for the totalOffers function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { totalOffers } from "thirdweb/extensions/marketplace";
 *
 * const result = await totalOffers({
 *  contract,
 * });
 *
 * ```
 */
export async function totalOffers(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
