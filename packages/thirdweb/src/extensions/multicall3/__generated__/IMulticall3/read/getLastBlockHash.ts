import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x27e86d6e" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    internalType: "bytes32",
    name: "blockHash",
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `getLastBlockHash` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getLastBlockHash` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isGetLastBlockHashSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isGetLastBlockHashSupported(contract);
 * ```
 */
export async function isGetLastBlockHashSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getLastBlockHash function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { decodeGetLastBlockHashResult } from "thirdweb/extensions/multicall3";
 * const result = decodeGetLastBlockHashResult("...");
 * ```
 */
export function decodeGetLastBlockHashResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getLastBlockHash" function on the contract.
 * @param options - The options for the getLastBlockHash function.
 * @returns The parsed result of the function call.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { getLastBlockHash } from "thirdweb/extensions/multicall3";
 *
 * const result = await getLastBlockHash({
 *  contract,
 * });
 *
 * ```
 */
export async function getLastBlockHash(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
