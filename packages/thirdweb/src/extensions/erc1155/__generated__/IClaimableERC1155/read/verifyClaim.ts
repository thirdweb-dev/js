import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "verifyClaim" function.
 */
export type VerifyClaimParams = {
  claimer: AbiParameterToPrimitiveType<{ type: "address"; name: "_claimer" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
};

export const FN_SELECTOR = "0x4bbb1abf" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_claimer",
  },
  {
    type: "uint256",
    name: "_tokenId",
  },
  {
    type: "uint256",
    name: "_quantity",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "verifyClaim" function.
 * @param options - The options for the verifyClaim function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeVerifyClaimParams } "thirdweb/extensions/erc1155";
 * const result = encodeVerifyClaimParams({
 *  claimer: ...,
 *  tokenId: ...,
 *  quantity: ...,
 * });
 * ```
 */
export function encodeVerifyClaimParams(options: VerifyClaimParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.claimer,
    options.tokenId,
    options.quantity,
  ]);
}

/**
 * Calls the "verifyClaim" function on the contract.
 * @param options - The options for the verifyClaim function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { verifyClaim } from "thirdweb/extensions/erc1155";
 *
 * const result = await verifyClaim({
 *  claimer: ...,
 *  tokenId: ...,
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
    params: [options.claimer, options.tokenId, options.quantity],
  });
}
