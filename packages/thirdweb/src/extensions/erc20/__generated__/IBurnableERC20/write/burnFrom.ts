import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "burnFrom" function.
 */

type BurnFromParamsInternal = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
};

export type BurnFromParams = Prettify<
  | BurnFromParamsInternal
  | {
      asyncParams: () => Promise<BurnFromParamsInternal>;
    }
>;
const METHOD = [
  "0x79cc6790",
  [
    {
      type: "address",
      name: "account",
    },
    {
      type: "uint256",
      name: "amount",
    },
  ],
  [],
] as const;

/**
 * Calls the "burnFrom" function on the contract.
 * @param options - The options for the "burnFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { burnFrom } from "thirdweb/extensions/erc20";
 *
 * const transaction = burnFrom({
 *  account: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burnFrom(options: BaseTransactionOptions<BurnFromParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.account, resolvedParams.amount] as const;
          }
        : [options.account, options.amount],
  });
}
