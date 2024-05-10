import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x01e1d114" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "totalManagedAssets",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `totalAssets` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `totalAssets` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isTotalAssetsSupported } from "thirdweb/extensions/erc4626";
 *
 * const supported = await isTotalAssetsSupported(contract);
 * ```
 */
export async function isTotalAssetsSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the totalAssets function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodeTotalAssetsResult } from "thirdweb/extensions/erc4626";
 * const result = decodeTotalAssetsResult("...");
 * ```
 */
export function decodeTotalAssetsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "totalAssets" function on the contract.
 * @param options - The options for the totalAssets function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { totalAssets } from "thirdweb/extensions/erc4626";
 *
 * const result = await totalAssets({
 *  contract,
 * });
 *
 * ```
 */
export async function totalAssets(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
