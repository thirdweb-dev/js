import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xcea943ee" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "primarySaleRecipient",
  },
] as const;

/**
 * Checks if the `getSaleConfig` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getSaleConfig` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetSaleConfigSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isGetSaleConfigSupported(contract);
 * ```
 */
export async function isGetSaleConfigSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getSaleConfig function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetSaleConfigResult } from "thirdweb/extensions/modular";
 * const result = decodeGetSaleConfigResult("...");
 * ```
 */
export function decodeGetSaleConfigResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getSaleConfig" function on the contract.
 * @param options - The options for the getSaleConfig function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getSaleConfig } from "thirdweb/extensions/modular";
 *
 * const result = await getSaleConfig({
 *  contract,
 * });
 *
 * ```
 */
export async function getSaleConfig(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
