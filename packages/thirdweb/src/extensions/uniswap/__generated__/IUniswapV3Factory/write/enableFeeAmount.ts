import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "enableFeeAmount" function.
 */
export type EnableFeeAmountParams = {
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
  tickSpacing: AbiParameterToPrimitiveType<{
    type: "int24";
    name: "tickSpacing";
  }>;
};

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
    method: [
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
    ],
    params: [options.fee, options.tickSpacing],
  });
}
