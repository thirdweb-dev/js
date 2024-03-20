import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "withdrawTo" function.
 */

type WithdrawToParamsInternal = {
  withdrawAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "withdrawAddress";
  }>;
  withdrawAmount: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "withdrawAmount";
  }>;
};

export type WithdrawToParams = Prettify<
  | WithdrawToParamsInternal
  | {
      asyncParams: () => Promise<WithdrawToParamsInternal>;
    }
>;
const METHOD = [
  "0x205c2878",
  [
    {
      type: "address",
      name: "withdrawAddress",
    },
    {
      type: "uint256",
      name: "withdrawAmount",
    },
  ],
  [],
] as const;

/**
 * Calls the "withdrawTo" function on the contract.
 * @param options - The options for the "withdrawTo" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { withdrawTo } from "thirdweb/extensions/erc4337";
 *
 * const transaction = withdrawTo({
 *  withdrawAddress: ...,
 *  withdrawAmount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdrawTo(options: BaseTransactionOptions<WithdrawToParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.withdrawAddress,
              resolvedParams.withdrawAmount,
            ] as const;
          }
        : [options.withdrawAddress, options.withdrawAmount],
  });
}
