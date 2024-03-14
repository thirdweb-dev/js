import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "feeAmountTickSpacing" function.
 */
export type FeeAmountTickSpacingParams = {
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
};

/**
 * Calls the "feeAmountTickSpacing" function on the contract.
 * @param options - The options for the feeAmountTickSpacing function.
 * @returns The parsed result of the function call.
 * @extension UNISWAP
 * @example
 * ```
 * import { feeAmountTickSpacing } from "thirdweb/extensions/uniswap";
 *
 * const result = await feeAmountTickSpacing({
 *  fee: ...,
 * });
 *
 * ```
 */
export async function feeAmountTickSpacing(
  options: BaseTransactionOptions<FeeAmountTickSpacingParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x22afcccb",
      [
        {
          type: "uint24",
          name: "fee",
        },
      ],
      [
        {
          type: "int24",
        },
      ],
    ],
    params: [options.fee],
  });
}
