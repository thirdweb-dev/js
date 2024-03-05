import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getStakeInfo" function.
 */
export type GetStakeInfoParams = {
  staker: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "staker";
    type: "address";
  }>;
};

/**
 * Calls the getStakeInfo function on the contract.
 * @param options - The options for the getStakeInfo function.
 * @returns The parsed result of the function call.
 * @extension ISTAKING1155
 * @example
 * ```
 * import { getStakeInfo } from "thirdweb/extensions/IStaking1155";
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
          internalType: "address",
          name: "staker",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint256[]",
          name: "_tokensStaked",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "_tokenAmounts",
          type: "uint256[]",
        },
        {
          internalType: "uint256",
          name: "_totalRewards",
          type: "uint256",
        },
      ],
    ],
    params: [options.staker],
  });
}
