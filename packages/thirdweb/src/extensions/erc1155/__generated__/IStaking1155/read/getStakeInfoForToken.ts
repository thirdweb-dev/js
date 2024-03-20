import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getStakeInfoForToken" function.
 */
export type GetStakeInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  staker: AbiParameterToPrimitiveType<{ type: "address"; name: "staker" }>;
};

const METHOD = [
  "0x168fb5c5",
  [
    {
      type: "uint256",
      name: "tokenId",
    },
    {
      type: "address",
      name: "staker",
    },
  ],
  [
    {
      type: "uint256",
      name: "_tokensStaked",
    },
    {
      type: "uint256",
      name: "_rewards",
    },
  ],
] as const;

/**
 * Calls the "getStakeInfoForToken" function on the contract.
 * @param options - The options for the getStakeInfoForToken function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```
 * import { getStakeInfoForToken } from "thirdweb/extensions/erc1155";
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
    method: METHOD,
    params: [options.tokenId, options.staker],
  });
}
