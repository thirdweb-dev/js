import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "remove" function.
 */

type RemoveParamsInternal = {
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
};

export type RemoveParams = Prettify<
  | RemoveParamsInternal
  | {
      asyncParams: () => Promise<RemoveParamsInternal>;
    }
>;
const METHOD = [
  "0x58edef4c",
  [
    {
      type: "bytes",
      name: "key",
    },
  ],
  [],
] as const;

/**
 * Calls the "remove" function on the contract.
 * @param options - The options for the "remove" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { remove } from "thirdweb/extensions/farcaster";
 *
 * const transaction = remove({
 *  key: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function remove(options: BaseTransactionOptions<RemoveParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.key] as const;
          }
        : [options.key],
  });
}
