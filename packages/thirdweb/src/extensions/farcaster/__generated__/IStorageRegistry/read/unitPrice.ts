import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xe73faa2d" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `unitPrice` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `unitPrice` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isUnitPriceSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isUnitPriceSupported(contract);
 * ```
 */
export async function isUnitPriceSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the unitPrice function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeUnitPriceResult } from "thirdweb/extensions/farcaster";
 * const result = decodeUnitPriceResult("...");
 * ```
 */
export function decodeUnitPriceResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "unitPrice" function on the contract.
 * @param options - The options for the unitPrice function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { unitPrice } from "thirdweb/extensions/farcaster";
 *
 * const result = await unitPrice({
 *  contract,
 * });
 *
 * ```
 */
export async function unitPrice(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
