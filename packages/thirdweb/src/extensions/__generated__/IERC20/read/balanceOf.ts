import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "balanceOf" function.
 */
export type BalanceOfParams = {
  who: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "who";
    type: "address";
  }>;
};

/**
 * Calls the balanceOf function on the contract.
 * @param options - The options for the balanceOf function.
 * @returns The parsed result of the function call.
 * @extension IERC20
 * @example
 * ```
 * import { balanceOf } from "thirdweb/extensions/IERC20";
 *
 * const result = await balanceOf({
 *  who: ...,
 * });
 *
 * ```
 */
export async function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x70a08231",
      [
        {
          internalType: "address",
          name: "who",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.who],
  });
}
