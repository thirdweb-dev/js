import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getAccountsOfSigner" function.
 */
export type GetAccountsOfSignerParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

export const FN_SELECTOR = "0x0e6254fd" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "signer",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address[]",
    name: "accounts",
  },
] as const;

/**
 * Checks if the `getAccountsOfSigner` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getAccountsOfSigner` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetAccountsOfSignerSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isGetAccountsOfSignerSupported(contract);
 * ```
 */
export async function isGetAccountsOfSignerSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getAccountsOfSigner" function.
 * @param options - The options for the getAccountsOfSigner function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetAccountsOfSignerParams } "thirdweb/extensions/erc4337";
 * const result = encodeGetAccountsOfSignerParams({
 *  signer: ...,
 * });
 * ```
 */
export function encodeGetAccountsOfSignerParams(
  options: GetAccountsOfSignerParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.signer]);
}

/**
 * Encodes the "getAccountsOfSigner" function into a Hex string with its parameters.
 * @param options - The options for the getAccountsOfSigner function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetAccountsOfSigner } "thirdweb/extensions/erc4337";
 * const result = encodeGetAccountsOfSigner({
 *  signer: ...,
 * });
 * ```
 */
export function encodeGetAccountsOfSigner(options: GetAccountsOfSignerParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetAccountsOfSignerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getAccountsOfSigner function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeGetAccountsOfSignerResult } from "thirdweb/extensions/erc4337";
 * const result = decodeGetAccountsOfSignerResult("...");
 * ```
 */
export function decodeGetAccountsOfSignerResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAccountsOfSigner" function on the contract.
 * @param options - The options for the getAccountsOfSigner function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getAccountsOfSigner } from "thirdweb/extensions/erc4337";
 *
 * const result = await getAccountsOfSigner({
 *  contract,
 *  signer: ...,
 * });
 *
 * ```
 */
export async function getAccountsOfSigner(
  options: BaseTransactionOptions<GetAccountsOfSignerParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.signer],
  });
}
