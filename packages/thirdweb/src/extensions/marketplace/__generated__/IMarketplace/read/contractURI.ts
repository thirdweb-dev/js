import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xe8a3d485" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Checks if the `contractURI` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `contractURI` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isContractURISupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isContractURISupported(contract);
 * ```
 */
export async function isContractURISupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the contractURI function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeContractURIResult } from "thirdweb/extensions/marketplace";
 * const result = decodeContractURIResult("...");
 * ```
 */
export function decodeContractURIResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "contractURI" function on the contract.
 * @param options - The options for the contractURI function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { contractURI } from "thirdweb/extensions/marketplace";
 *
 * const result = await contractURI({
 *  contract,
 * });
 *
 * ```
 */
export async function contractURI(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
