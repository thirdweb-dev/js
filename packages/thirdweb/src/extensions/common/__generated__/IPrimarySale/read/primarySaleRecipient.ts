import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x079fe40e" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `primarySaleRecipient` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `primarySaleRecipient` method is supported.
 * @extension COMMON
 * @example
 * ```ts
 * import { isPrimarySaleRecipientSupported } from "thirdweb/extensions/common";
 *
 * const supported = await isPrimarySaleRecipientSupported(contract);
 * ```
 */
export async function isPrimarySaleRecipientSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the primarySaleRecipient function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension COMMON
 * @example
 * ```ts
 * import { decodePrimarySaleRecipientResult } from "thirdweb/extensions/common";
 * const result = decodePrimarySaleRecipientResult("...");
 * ```
 */
export function decodePrimarySaleRecipientResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "primarySaleRecipient" function on the contract.
 * @param options - The options for the primarySaleRecipient function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```ts
 * import { primarySaleRecipient } from "thirdweb/extensions/common";
 *
 * const result = await primarySaleRecipient({
 *  contract,
 * });
 *
 * ```
 */
export async function primarySaleRecipient(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
