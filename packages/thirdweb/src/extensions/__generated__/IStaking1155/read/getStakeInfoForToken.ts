import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getStakeInfoForToken" function.
 */
export type GetStakeInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  staker: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "staker";
    type: "address";
  }>;
};

/**
 * Calls the getStakeInfoForToken function on the contract.
 * @param options - The options for the getStakeInfoForToken function.
 * @returns The parsed result of the function call.
 * @extension ISTAKING1155
 * @example
 * ```
 * import { getStakeInfoForToken } from "thirdweb/extensions/IStaking1155";
 *
 * const result = await getStakeInfoForToken({
 *  tokenId: ...,
 *  staker: ...,
 * });
 *
 * ```
 */
export async function getStakeInfoForToken(
  options: BaseTransactionOptions<GetStakeInfoForTokenParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x168fb5c5",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "staker",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "_tokensStaked",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_rewards",
          type: "uint256",
        },
      ],
    ],
    params: [options.tokenId, options.staker],
  });
}
