import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "allowance" function.
 */
export type AllowanceParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  spender: AbiParameterToPrimitiveType<{ type: "address"; name: "spender" }>;
};

/**
 * Calls the "allowance" function on the contract.
 * @param options - The options for the allowance function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```
 * import { allowance } from "thirdweb/extensions/erc20";
 *
 * const result = await allowance({
 *  owner: ...,
 *  spender: ...,
 * });
 *
 * ```
 */
export async function allowance(
  options: BaseTransactionOptions<AllowanceParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xdd62ed3e",
      [
        {
          type: "address",
          name: "owner",
        },
        {
          type: "address",
          name: "spender",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.owner, options.spender],
  });
}
