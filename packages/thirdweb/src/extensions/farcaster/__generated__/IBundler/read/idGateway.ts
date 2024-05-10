import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x4b57a600" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `idGateway` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `idGateway` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isIdGatewaySupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isIdGatewaySupported(contract);
 * ```
 */
export async function isIdGatewaySupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the idGateway function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeIdGatewayResult } from "thirdweb/extensions/farcaster";
 * const result = decodeIdGatewayResult("...");
 * ```
 */
export function decodeIdGatewayResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "idGateway" function on the contract.
 * @param options - The options for the idGateway function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { idGateway } from "thirdweb/extensions/farcaster";
 *
 * const result = await idGateway({
 *  contract,
 * });
 *
 * ```
 */
export async function idGateway(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
