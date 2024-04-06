import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "stake" function.
 */

export type StakeParams = {
  tokenIds: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "tokenIds";
  }>;
};

export const FN_SELECTOR = "0x0fbf0a93" as const;
const FN_INPUTS = [
  {
    type: "uint256[]",
    name: "tokenIds",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "stake" function.
 * @param options - The options for the stake function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeStakeParams } "thirdweb/extensions/erc721";
 * const result = encodeStakeParams({
 *  tokenIds: ...,
 * });
 * ```
 */
export function encodeStakeParams(options: StakeParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenIds]);
}

/**
 * Calls the "stake" function on the contract.
 * @param options - The options for the "stake" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { stake } from "thirdweb/extensions/erc721";
 *
 * const transaction = stake({
 *  contract,
 *  tokenIds: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function stake(
  options: BaseTransactionOptions<
    | StakeParams
    | {
        asyncParams: () => Promise<StakeParams>;
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
            return [resolvedParams.tokenIds] as const;
          }
        : [options.tokenIds],
  });
}
