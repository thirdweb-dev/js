import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getPastVotes" function.
 */
export type GetPastVotesParams = {
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
  blockNumber: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "blockNumber";
    type: "uint256";
  }>;
};

/**
 * Calls the "getPastVotes" function on the contract.
 * @param options - The options for the getPastVotes function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```
 * import { getPastVotes } from "thirdweb/extensions/erc20";
 *
 * const result = await getPastVotes({
 *  account: ...,
 *  blockNumber: ...,
 * });
 *
 * ```
 */
export async function getPastVotes(
  options: BaseTransactionOptions<GetPastVotesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x3a46b1a8",
      [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "blockNumber",
          type: "uint256",
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
    params: [options.account, options.blockNumber],
  });
}
