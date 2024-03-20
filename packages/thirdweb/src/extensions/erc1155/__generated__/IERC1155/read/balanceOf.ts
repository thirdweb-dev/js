import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "balanceOf" function.
 */
export type BalanceOfParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "_owner" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

/**
 * Calls the "balanceOf" function on the contract.
 * @param options - The options for the balanceOf function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```
 * import { balanceOf } from "thirdweb/extensions/erc1155";
 *
 * const result = await balanceOf({
 *  owner: ...,
 *  tokenId: ...,
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
      "0x00fdd58e",
      [
        {
          type: "address",
          name: "_owner",
        },
        {
          type: "uint256",
          name: "tokenId",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.owner, options.tokenId],
  });
}
