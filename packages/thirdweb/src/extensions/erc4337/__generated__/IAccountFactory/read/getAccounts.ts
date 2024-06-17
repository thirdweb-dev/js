import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getAccounts" function.
 */
export type GetAccountsParams = {
  start: AbiParameterToPrimitiveType<{ type: "uint256"; name: "start" }>;
  end: AbiParameterToPrimitiveType<{ type: "uint256"; name: "end" }>;
};

export const FN_SELECTOR = "0xe68a7c3b" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "start",
  },
  {
    type: "uint256",
    name: "end",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address[]",
  },
] as const;

/**
 * Checks if the `getAccounts` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getAccounts` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetAccountsSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isGetAccountsSupported(contract);
 * ```
 */
export async function isGetAccountsSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAccounts" function.
 * @param options - The options for the getAccounts function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetAccountsParams } "thirdweb/extensions/erc4337";
 * const result = encodeGetAccountsParams({
 *  start: ...,
 *  end: ...,
 * });
 * ```
 */
export function encodeGetAccountsParams(options: GetAccountsParams) {
  return encodeAbiParameters(FN_INPUTS, [options.start, options.end]);
}

/**
 * Encodes the "getAccounts" function into a Hex string with its parameters.
 * @param options - The options for the getAccounts function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetAccounts } "thirdweb/extensions/erc4337";
 * const result = encodeGetAccounts({
 *  start: ...,
 *  end: ...,
 * });
 * ```
 */
export function encodeGetAccounts(options: GetAccountsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetAccountsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getAccounts function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeGetAccountsResult } from "thirdweb/extensions/erc4337";
 * const result = decodeGetAccountsResult("...");
 * ```
 */
export function decodeGetAccountsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAccounts" function on the contract.
 * @param options - The options for the getAccounts function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getAccounts } from "thirdweb/extensions/erc4337";
 *
 * const result = await getAccounts({
 *  contract,
 *  start: ...,
 *  end: ...,
 * });
 *
 * ```
 */
export async function getAccounts(
  options: BaseTransactionOptions<GetAccountsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.start, options.end],
  });
}
