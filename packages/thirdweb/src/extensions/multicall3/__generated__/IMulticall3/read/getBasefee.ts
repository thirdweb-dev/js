import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x3e64a696" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    internalType: "uint256",
    name: "basefee",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getBasefee` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getBasefee` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isGetBasefeeSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isGetBasefeeSupported(contract);
 * ```
 */
export async function isGetBasefeeSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getBasefee function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { decodeGetBasefeeResult } from "thirdweb/extensions/multicall3";
 * const result = decodeGetBasefeeResult("...");
 * ```
 */
export function decodeGetBasefeeResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getBasefee" function on the contract.
 * @param options - The options for the getBasefee function.
 * @returns The parsed result of the function call.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { getBasefee } from "thirdweb/extensions/multicall3";
 *
 * const result = await getBasefee({
 *  contract,
 * });
 *
 * ```
 */
export async function getBasefee(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
