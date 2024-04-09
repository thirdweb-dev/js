import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "claim" function.
 */

export type ClaimParams = {
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "_receiver" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
};

export const FN_SELECTOR = "0xaad3ec96" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_receiver",
  },
  {
    type: "uint256",
    name: "_quantity",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "claim" function.
 * @param options - The options for the claim function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeClaimParams } "thirdweb/extensions/erc721";
 * const result = encodeClaimParams({
 *  receiver: ...,
 *  quantity: ...,
 * });
 * ```
 */
export function encodeClaimParams(options: ClaimParams) {
  return encodeAbiParameters(FN_INPUTS, [options.receiver, options.quantity]);
}

/**
 * Calls the "claim" function on the contract.
 * @param options - The options for the "claim" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { claim } from "thirdweb/extensions/erc721";
 *
 * const transaction = claim({
 *  contract,
 *  receiver: ...,
 *  quantity: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claim(
  options: BaseTransactionOptions<
    | ClaimParams
    | {
        asyncParams: () => Promise<ClaimParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.receiver, resolvedParams.quantity] as const;
          }
        : [options.receiver, options.quantity],
  });
}
