import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x84b0196e" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "fields",
    type: "bytes1",
    internalType: "bytes1",
  },
  {
    name: "name",
    type: "string",
    internalType: "string",
  },
  {
    name: "version",
    type: "string",
    internalType: "string",
  },
  {
    name: "chainId",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "verifyingContract",
    type: "address",
    internalType: "address",
  },
  {
    name: "salt",
    type: "bytes32",
    internalType: "bytes32",
  },
  {
    name: "extensions",
    type: "uint256[]",
    internalType: "uint256[]",
  },
] as const;

/**
 * Checks if the `eip712Domain` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `eip712Domain` method is supported.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { isEip712DomainSupported } from "thirdweb/extensions/airdrop";
 *
 * const supported = await isEip712DomainSupported(contract);
 * ```
 */
export async function isEip712DomainSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Decodes the result of the eip712Domain function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { decodeEip712DomainResult } from "thirdweb/extensions/airdrop";
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
 * @extension AIRDROP
 * @example
 * ```ts
 * import { eip712Domain } from "thirdweb/extensions/airdrop";
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
