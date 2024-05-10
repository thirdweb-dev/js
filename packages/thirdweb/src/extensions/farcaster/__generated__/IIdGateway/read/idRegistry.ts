import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x0aa13b8c" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `idRegistry` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `idRegistry` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isIdRegistrySupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isIdRegistrySupported(contract);
 * ```
 */
export async function isIdRegistrySupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the idRegistry function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeIdRegistryResult } from "thirdweb/extensions/farcaster";
 * const result = decodeIdRegistryResult("...");
 * ```
 */
export function decodeIdRegistryResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "idRegistry" function on the contract.
 * @param options - The options for the idRegistry function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { idRegistry } from "thirdweb/extensions/farcaster";
 *
 * const result = await idRegistry({
 *  contract,
 * });
 *
 * ```
 */
export async function idRegistry(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
