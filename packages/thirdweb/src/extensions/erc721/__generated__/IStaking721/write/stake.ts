import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "stake" function.
 */

type StakeParamsInternal = {
  tokenIds: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "tokenIds";
  }>;
};

export type StakeParams = Prettify<
  | StakeParamsInternal
  | {
      asyncParams: () => Promise<StakeParamsInternal>;
    }
>;
/**
 * Calls the "stake" function on the contract.
 * @param options - The options for the "stake" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { stake } from "thirdweb/extensions/erc721";
 *
 * const transaction = stake({
 *  tokenIds: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function stake(options: BaseTransactionOptions<StakeParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x0fbf0a93",
      [
        {
          type: "uint256[]",
          name: "tokenIds",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.tokenIds] as const;
          }
        : [options.tokenIds],
  });
}
