import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "burn" function.
 */

type BurnParamsInternal = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "id" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
};

export type BurnParams = Prettify<
  | BurnParamsInternal
  | {
      asyncParams: () => Promise<BurnParamsInternal>;
    }
>;
/**
 * Calls the "burn" function on the contract.
 * @param options - The options for the "burn" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { burn } from "thirdweb/extensions/erc1155";
 *
 * const transaction = burn({
 *  account: ...,
 *  id: ...,
 *  value: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burn(options: BaseTransactionOptions<BurnParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xf5298aca",
      [
        {
          type: "address",
          name: "account",
        },
        {
          type: "uint256",
          name: "id",
        },
        {
          type: "uint256",
          name: "value",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.account,
              resolvedParams.id,
              resolvedParams.value,
            ] as const;
          }
        : [options.account, options.id, options.value],
  });
}
