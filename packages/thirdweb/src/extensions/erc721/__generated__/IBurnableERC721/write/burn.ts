import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "burn" function.
 */

export type BurnParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x42966c68" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "burn" function.
 * @param options - The options for the burn function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeBurnParams } "thirdweb/extensions/erc721";
 * const result = encodeBurnParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeBurnParams(options: BurnParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Calls the "burn" function on the contract.
 * @param options - The options for the "burn" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { burn } from "thirdweb/extensions/erc721";
 *
 * const transaction = burn({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burn(
  options: BaseTransactionOptions<
    | BurnParams
    | {
        asyncParams: () => Promise<BurnParams>;
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
            return [resolvedParams.tokenId] as const;
          }
        : [options.tokenId],
  });
}
