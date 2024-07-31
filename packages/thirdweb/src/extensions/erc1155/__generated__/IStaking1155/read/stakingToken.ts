import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x72f702f3" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `stakingToken` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `stakingToken` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isStakingTokenSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = await isStakingTokenSupported(contract);
 * ```
 */
export async function isStakingTokenSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the stakingToken function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeStakingTokenResult } from "thirdweb/extensions/erc1155";
 * const result = decodeStakingTokenResult("...");
 * ```
 */
export function decodeStakingTokenResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "stakingToken" function on the contract.
 * @param options - The options for the stakingToken function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { stakingToken } from "thirdweb/extensions/erc1155";
 *
 * const result = await stakingToken({
 *  contract,
 * });
 *
 * ```
 */
export async function stakingToken(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
