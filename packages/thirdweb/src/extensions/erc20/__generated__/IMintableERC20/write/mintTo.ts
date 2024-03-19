import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "mintTo" function.
 */

type MintToParamsInternal = {
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
};

export type MintToParams = Prettify<
  | MintToParamsInternal
  | {
      asyncParams: () => Promise<MintToParamsInternal>;
    }
>;
/**
 * Calls the "mintTo" function on the contract.
 * @param options - The options for the "mintTo" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { mintTo } from "thirdweb/extensions/erc20";
 *
 * const transaction = mintTo({
 *  to: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mintTo(options: BaseTransactionOptions<MintToParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x449a52f8",
      [
        {
          type: "address",
          name: "to",
        },
        {
          type: "uint256",
          name: "amount",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.to, resolvedParams.amount] as const;
      }

      return [options.to, options.amount] as const;
    },
  });
}
