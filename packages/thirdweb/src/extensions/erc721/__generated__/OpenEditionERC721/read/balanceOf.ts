import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "balanceOf" function.
 */
export type BalanceOfParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
};

/**
 * Calls the "balanceOf" function on the contract.
 * @param options - The options for the balanceOf function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { balanceOf } from "thirdweb/extensions/erc721";
 *
 * const result = await balanceOf({
 *  owner: ...,
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
          type: "address",
          name: "owner",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.owner],
  });
}
