import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x38d52e0f" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "assetTokenAddress",
    type: "address",
    internalType: "contract ERC20",
  },
] as const;

/**
 * Checks if the `asset` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `asset` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isAssetSupported } from "thirdweb/extensions/erc4626";
 *
 * const supported = await isAssetSupported(contract);
 * ```
 */
export async function isAssetSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the asset function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodeAssetResult } from "thirdweb/extensions/erc4626";
 * const result = decodeAssetResult("...");
 * ```
 */
export function decodeAssetResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "asset" function on the contract.
 * @param options - The options for the asset function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { asset } from "thirdweb/extensions/erc4626";
 *
 * const result = await asset({
 *  contract,
 * });
 *
 * ```
 */
export async function asset(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
