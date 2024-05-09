import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x3644e515" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
  },
] as const;

/**
 * Checks if the `DOMAIN_SEPARATOR` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `DOMAIN_SEPARATOR` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isDOMAIN_SEPARATORSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = await isDOMAIN_SEPARATORSupported(contract);
 * ```
 */
export async function isDOMAIN_SEPARATORSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the DOMAIN_SEPARATOR function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC20
 * @example
 * ```ts
 * import { decodeDOMAIN_SEPARATORResult } from "thirdweb/extensions/erc20";
 * const result = decodeDOMAIN_SEPARATORResult("...");
 * ```
 */
export function decodeDOMAIN_SEPARATORResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "DOMAIN_SEPARATOR" function on the contract.
 * @param options - The options for the DOMAIN_SEPARATOR function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```ts
 * import { DOMAIN_SEPARATOR } from "thirdweb/extensions/erc20";
 *
 * const result = await DOMAIN_SEPARATOR({
 *  contract,
 * });
 *
 * ```
 */
export async function DOMAIN_SEPARATOR(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
