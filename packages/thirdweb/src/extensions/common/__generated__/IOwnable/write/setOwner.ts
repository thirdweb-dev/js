import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setOwner" function.
 */

type SetOwnerParamsInternal = {
  newOwner: AbiParameterToPrimitiveType<{ type: "address"; name: "_newOwner" }>;
};

export type SetOwnerParams = Prettify<
  | SetOwnerParamsInternal
  | {
      asyncParams: () => Promise<SetOwnerParamsInternal>;
    }
>;
const METHOD = [
  "0x13af4035",
  [
    {
      type: "address",
      name: "_newOwner",
    },
  ],
  [],
] as const;

/**
 * Calls the "setOwner" function on the contract.
 * @param options - The options for the "setOwner" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { setOwner } from "thirdweb/extensions/common";
 *
 * const transaction = setOwner({
 *  newOwner: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setOwner(options: BaseTransactionOptions<SetOwnerParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.newOwner] as const;
          }
        : [options.newOwner],
  });
}
