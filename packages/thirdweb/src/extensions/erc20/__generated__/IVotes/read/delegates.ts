import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "delegates" function.
 */
export type DelegatesParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

const METHOD = [
  "0x587cde1e",
  [
    {
      type: "address",
      name: "account",
    },
  ],
  [
    {
      type: "address",
    },
  ],
] as const;

/**
 * Calls the "delegates" function on the contract.
 * @param options - The options for the delegates function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```
 * import { delegates } from "thirdweb/extensions/erc20";
 *
 * const result = await delegates({
 *  account: ...,
 * });
 *
 * ```
 */
export async function delegates(
  options: BaseTransactionOptions<DelegatesParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.account],
  });
}
