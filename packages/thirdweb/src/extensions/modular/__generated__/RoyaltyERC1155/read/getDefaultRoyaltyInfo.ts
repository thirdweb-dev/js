import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xb24f2d39" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "address",
    internalType: "address",
  },
  {
    name: "",
    type: "uint16",
    internalType: "uint16",
  },
] as const;

/**
 * Checks if the `getDefaultRoyaltyInfo` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getDefaultRoyaltyInfo` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetDefaultRoyaltyInfoSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isGetDefaultRoyaltyInfoSupported(contract);
 * ```
 */
export async function isGetDefaultRoyaltyInfoSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getDefaultRoyaltyInfo function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetDefaultRoyaltyInfoResult } from "thirdweb/extensions/modular";
 * const result = decodeGetDefaultRoyaltyInfoResult("...");
 * ```
 */
export function decodeGetDefaultRoyaltyInfoResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getDefaultRoyaltyInfo" function on the contract.
 * @param options - The options for the getDefaultRoyaltyInfo function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getDefaultRoyaltyInfo } from "thirdweb/extensions/modular";
 *
 * const result = await getDefaultRoyaltyInfo({
 *  contract,
 * });
 *
 * ```
 */
export async function getDefaultRoyaltyInfo(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
