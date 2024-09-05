import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x84b0196e" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "bytes1",
    name: "fields",
  },
  {
    type: "string",
    name: "name",
  },
  {
    type: "string",
    name: "version",
  },
  {
    type: "uint256",
    name: "chainId",
  },
  {
    type: "address",
    name: "verifyingContract",
  },
  {
    type: "bytes32",
    name: "salt",
  },
  {
    type: "uint256[]",
    name: "extensions",
  },
] as const;

/**
 * Checks if the `eip712Domain` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `eip712Domain` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isEip712DomainSupported } from "thirdweb/extensions/modular";
 *
 * const supported = isEip712DomainSupported(["0x..."]);
 * ```
 */
export function isEip712DomainSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the eip712Domain function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeEip712DomainResult } from "thirdweb/extensions/modular";
 * const result = decodeEip712DomainResult("...");
 * ```
 */
export function decodeEip712DomainResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "eip712Domain" function on the contract.
 * @param options - The options for the eip712Domain function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { eip712Domain } from "thirdweb/extensions/modular";
 *
 * const result = await eip712Domain({
 *  contract,
 * });
 *
 * ```
 */
export async function eip712Domain(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
