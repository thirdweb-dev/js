import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getStakeInfo" function.
 */
export type GetStakeInfoParams = {
  staker: AbiParameterToPrimitiveType<{ type: "address"; name: "staker" }>;
};

/**
 * Calls the "getStakeInfo" function on the contract.
 * @param options - The options for the getStakeInfo function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```
 * import { getStakeInfo } from "thirdweb/extensions/erc1155";
 *
 * const result = await getStakeInfo({
 *  staker: ...,
 * });
 *
 * ```
 */
export async function getStakeInfo(
  options: BaseTransactionOptions<GetStakeInfoParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc3453153",
      [
        {
          type: "address",
          name: "staker",
        },
      ],
      [
        {
          type: "uint256[]",
          name: "_tokensStaked",
        },
        {
          type: "uint256[]",
          name: "_tokenAmounts",
        },
        {
          type: "uint256",
          name: "_totalRewards",
        },
      ],
    ],
    params: [options.staker],
  });
}
