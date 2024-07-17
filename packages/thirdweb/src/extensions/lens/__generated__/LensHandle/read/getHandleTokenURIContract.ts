import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x35eb3cb9" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `getHandleTokenURIContract` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getHandleTokenURIContract` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetHandleTokenURIContractSupported } from "thirdweb/extensions/lens";
 *
 * const supported = await isGetHandleTokenURIContractSupported(contract);
 * ```
 */
export async function isGetHandleTokenURIContractSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getHandleTokenURIContract function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetHandleTokenURIContractResult } from "thirdweb/extensions/lens";
 * const result = decodeGetHandleTokenURIContractResult("...");
 * ```
 */
export function decodeGetHandleTokenURIContractResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getHandleTokenURIContract" function on the contract.
 * @param options - The options for the getHandleTokenURIContract function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getHandleTokenURIContract } from "thirdweb/extensions/lens";
 *
 * const result = await getHandleTokenURIContract({
 *  contract,
 * });
 *
 * ```
 */
export async function getHandleTokenURIContract(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
