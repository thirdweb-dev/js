import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xc68907de" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getActiveClaimConditionId` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getActiveClaimConditionId` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isGetActiveClaimConditionIdSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = await isGetActiveClaimConditionIdSupported(contract);
 * ```
 */
export async function isGetActiveClaimConditionIdSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getActiveClaimConditionId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC20
 * @example
 * ```ts
 * import { decodeGetActiveClaimConditionIdResult } from "thirdweb/extensions/erc20";
 * const result = decodeGetActiveClaimConditionIdResult("...");
 * ```
 */
export function decodeGetActiveClaimConditionIdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getActiveClaimConditionId" function on the contract.
 * @param options - The options for the getActiveClaimConditionId function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```ts
 * import { getActiveClaimConditionId } from "thirdweb/extensions/erc20";
 *
 * const result = await getActiveClaimConditionId({
 *  contract,
 * });
 *
 * ```
 */
export async function getActiveClaimConditionId(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
