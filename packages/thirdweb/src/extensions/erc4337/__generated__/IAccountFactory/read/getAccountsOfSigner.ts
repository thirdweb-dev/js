import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

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
