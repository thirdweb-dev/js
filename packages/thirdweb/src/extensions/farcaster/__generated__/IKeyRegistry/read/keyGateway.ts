import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x80334737" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `keyGateway` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `keyGateway` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isKeyGatewaySupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isKeyGatewaySupported(contract);
 * ```
 */
export async function isKeyGatewaySupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the keyGateway function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeKeyGatewayResult } from "thirdweb/extensions/farcaster";
 * const result = decodeKeyGatewayResult("...");
 * ```
 */
export function decodeKeyGatewayResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "keyGateway" function on the contract.
 * @param options - The options for the keyGateway function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { keyGateway } from "thirdweb/extensions/farcaster";
 *
 * const result = await keyGateway({
 *  contract,
 * });
 *
 * ```
 */
export async function keyGateway(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
