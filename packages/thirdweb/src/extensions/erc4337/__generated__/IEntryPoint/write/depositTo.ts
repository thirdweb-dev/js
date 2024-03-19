import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "depositTo" function.
 */

type DepositToParamsInternal = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export type DepositToParams = Prettify<
  | DepositToParamsInternal
  | {
      asyncParams: () => Promise<DepositToParamsInternal>;
    }
>;
/**
 * Calls the "depositTo" function on the contract.
 * @param options - The options for the "depositTo" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { depositTo } from "thirdweb/extensions/erc4337";
 *
 * const transaction = depositTo({
 *  account: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function depositTo(options: BaseTransactionOptions<DepositToParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xb760faf9",
      [
        {
          type: "address",
          name: "account",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.account] as const;
      }

      return [options.account] as const;
    },
  });
}
