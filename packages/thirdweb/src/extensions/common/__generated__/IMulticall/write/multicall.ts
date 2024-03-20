import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "multicall" function.
 */

type MulticallParamsInternal = {
  data: AbiParameterToPrimitiveType<{ type: "bytes[]"; name: "data" }>;
};

export type MulticallParams = Prettify<
  | MulticallParamsInternal
  | {
      asyncParams: () => Promise<MulticallParamsInternal>;
    }
>;
const METHOD = [
  "0xac9650d8",
  [
    {
      type: "bytes[]",
      name: "data",
    },
  ],
  [
    {
      type: "bytes[]",
      name: "results",
    },
  ],
] as const;

/**
 * Calls the "multicall" function on the contract.
 * @param options - The options for the "multicall" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { multicall } from "thirdweb/extensions/common";
 *
 * const transaction = multicall({
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function multicall(options: BaseTransactionOptions<MulticallParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.data] as const;
          }
        : [options.data],
  });
}
