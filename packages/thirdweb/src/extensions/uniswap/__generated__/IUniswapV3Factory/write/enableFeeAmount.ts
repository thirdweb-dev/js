import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "enableFeeAmount" function.
 */

type EnableFeeAmountParamsInternal = {
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
  tickSpacing: AbiParameterToPrimitiveType<{
    type: "int24";
    name: "tickSpacing";
  }>;
};

export type EnableFeeAmountParams = Prettify<
  | EnableFeeAmountParamsInternal
  | {
      asyncParams: () => Promise<EnableFeeAmountParamsInternal>;
    }
>;
const METHOD = [
  "0x8a7c195f",
  [
    {
      type: "uint24",
      name: "fee",
    },
    {
      type: "int24",
      name: "tickSpacing",
    },
  ],
  [],
] as const;

/**
 * Calls the "enableFeeAmount" function on the contract.
 * @param options - The options for the "enableFeeAmount" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```
 * import { enableFeeAmount } from "thirdweb/extensions/uniswap";
 *
 * const transaction = enableFeeAmount({
 *  fee: ...,
 *  tickSpacing: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function enableFeeAmount(
  options: BaseTransactionOptions<EnableFeeAmountParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.fee, resolvedParams.tickSpacing] as const;
          }
        : [options.fee, options.tickSpacing],
  });
}
