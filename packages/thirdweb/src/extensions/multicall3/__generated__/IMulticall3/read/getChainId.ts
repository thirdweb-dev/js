import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x3408e470" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    internalType: "uint256",
    name: "chainid",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getChainId` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getChainId` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isGetChainIdSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isGetChainIdSupported(contract);
 * ```
 */
export async function isGetChainIdSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getChainId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { decodeGetChainIdResult } from "thirdweb/extensions/multicall3";
 * const result = decodeGetChainIdResult("...");
 * ```
 */
export function decodeGetChainIdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getChainId" function on the contract.
 * @param options - The options for the getChainId function.
 * @returns The parsed result of the function call.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { getChainId } from "thirdweb/extensions/multicall3";
 *
 * const result = await getChainId({
 *  contract,
 * });
 *
 * ```
 */
export async function getChainId(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
