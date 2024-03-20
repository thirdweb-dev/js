import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "balanceOf" function.
 */
export type BalanceOfParams = {
  address: AbiParameterToPrimitiveType<{ type: "address"; name: "_address" }>;
};

const METHOD = [
  "0x70a08231",
  [
    {
      type: "address",
      name: "_address",
    },
  ],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "balanceOf" function on the contract.
 * @param options - The options for the balanceOf function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```
 * import { balanceOf } from "thirdweb/extensions/erc20";
 *
 * const result = await balanceOf({
 *  address: ...,
 * });
 *
 * ```
 */
export async function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.address],
  });
}
