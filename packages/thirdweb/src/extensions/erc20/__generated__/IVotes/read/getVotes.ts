import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getVotes" function.
 */
export type GetVotesParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

/**
 * Calls the "getVotes" function on the contract.
 * @param options - The options for the getVotes function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```
 * import { getVotes } from "thirdweb/extensions/erc20";
 *
 * const result = await getVotes({
 *  account: ...,
 * });
 *
 * ```
 */
export async function getVotes(
  options: BaseTransactionOptions<GetVotesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x9ab24eb0",
      [
        {
          type: "address",
          name: "account",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.account],
  });
}
