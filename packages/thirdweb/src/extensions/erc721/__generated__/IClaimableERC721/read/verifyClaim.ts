import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "verifyClaim" function.
 */
export type VerifyClaimParams = {
  claimer: AbiParameterToPrimitiveType<{ type: "address"; name: "_claimer" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
};

export const FN_SELECTOR = "0x2f92023a" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_claimer",
  },
  {
    type: "uint256",
    name: "_quantity",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `verifyClaim` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `verifyClaim` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isVerifyClaimSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isVerifyClaimSupported(contract);
 * ```
 */
export async function isVerifyClaimSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "verifyClaim" function.
 * @param options - The options for the verifyClaim function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeVerifyClaimParams } "thirdweb/extensions/erc721";
 * const result = encodeVerifyClaimParams({
 *  claimer: ...,
 *  quantity: ...,
 * });
 * ```
 */
export function encodeVerifyClaimParams(options: VerifyClaimParams) {
  return encodeAbiParameters(FN_INPUTS, [options.claimer, options.quantity]);
}

/**
 * Encodes the "verifyClaim" function into a Hex string with its parameters.
 * @param options - The options for the verifyClaim function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeVerifyClaim } "thirdweb/extensions/erc721";
 * const result = encodeVerifyClaim({
 *  claimer: ...,
 *  quantity: ...,
 * });
 * ```
 */
export function encodeVerifyClaim(options: VerifyClaimParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeVerifyClaimParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Calls the "verifyClaim" function on the contract.
 * @param options - The options for the verifyClaim function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { verifyClaim } from "thirdweb/extensions/erc721";
 *
 * const result = await verifyClaim({
 *  contract,
 *  claimer: ...,
 *  quantity: ...,
 * });
 *
 * ```
 */
export async function verifyClaim(
  options: BaseTransactionOptions<VerifyClaimParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.claimer, options.quantity],
  });
}
