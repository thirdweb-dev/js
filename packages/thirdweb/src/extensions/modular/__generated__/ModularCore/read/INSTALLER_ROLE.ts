import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x4f637650" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `INSTALLER_ROLE` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `INSTALLER_ROLE` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isINSTALLER_ROLESupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isINSTALLER_ROLESupported(contract);
 * ```
 */
export async function isINSTALLER_ROLESupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the INSTALLER_ROLE function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeINSTALLER_ROLEResult } from "thirdweb/extensions/modular";
 * const result = decodeINSTALLER_ROLEResult("...");
 * ```
 */
export function decodeINSTALLER_ROLEResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "INSTALLER_ROLE" function on the contract.
 * @param options - The options for the INSTALLER_ROLE function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { INSTALLER_ROLE } from "thirdweb/extensions/modular";
 *
 * const result = await INSTALLER_ROLE({
 *  contract,
 * });
 *
 * ```
 */
export async function INSTALLER_ROLE(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
