import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getScore" function.
 */
export type GetScoreParams = {
  tokenOwner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_tokenOwner";
  }>;
};

/**
 * Calls the "getScore" function on the contract.
 * @param options - The options for the getScore function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```
 * import { getScore } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getScore({
 *  tokenOwner: ...,
 * });
 *
 * ```
 */
export async function getScore(
  options: BaseTransactionOptions<GetScoreParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xd47875d0",
      [
        {
          type: "address",
          name: "_tokenOwner",
        },
      ],
      [
        {
          type: "uint256",
          name: "score",
        },
      ],
    ],
    params: [options.tokenOwner],
  });
}
