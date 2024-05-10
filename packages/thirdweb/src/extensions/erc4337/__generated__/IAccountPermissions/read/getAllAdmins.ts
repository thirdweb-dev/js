import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xe9523c97" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address[]",
    name: "admins",
  },
] as const;

/**
 * Checks if the `getAllAdmins` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getAllAdmins` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetAllAdminsSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isGetAllAdminsSupported(contract);
 * ```
 */
export async function isGetAllAdminsSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the getAllAdmins function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeGetAllAdminsResult } from "thirdweb/extensions/erc4337";
 * const result = decodeGetAllAdminsResult("...");
 * ```
 */
export function decodeGetAllAdminsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllAdmins" function on the contract.
 * @param options - The options for the getAllAdmins function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getAllAdmins } from "thirdweb/extensions/erc4337";
 *
 * const result = await getAllAdmins({
 *  contract,
 * });
 *
 * ```
 */
export async function getAllAdmins(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
