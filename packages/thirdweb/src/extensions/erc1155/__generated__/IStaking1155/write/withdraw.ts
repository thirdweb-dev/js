import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "withdraw" function.
 */

type WithdrawParamsInternal = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  amount: AbiParameterToPrimitiveType<{ type: "uint64"; name: "amount" }>;
};

export type WithdrawParams = Prettify<
  | WithdrawParamsInternal
  | {
      asyncParams: () => Promise<WithdrawParamsInternal>;
    }
>;
/**
 * Calls the "withdraw" function on the contract.
 * @param options - The options for the "withdraw" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { withdraw } from "thirdweb/extensions/erc1155";
 *
 * const transaction = withdraw({
 *  tokenId: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdraw(options: BaseTransactionOptions<WithdrawParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xc434dcfe",
      [
        {
          type: "uint256",
          name: "tokenId",
        },
        {
          type: "uint64",
          name: "amount",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.tokenId, resolvedParams.amount] as const;
          }
        : [options.tokenId, options.amount],
  });
}
