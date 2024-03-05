import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "tokensOfOwnerIn" function.
 */
export type TokensOfOwnerInParams = {
  owner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "owner";
    type: "address";
  }>;
  start: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "start";
    type: "uint256";
  }>;
  stop: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "stop";
    type: "uint256";
  }>;
};

/**
 * Calls the "tokensOfOwnerIn" function on the contract.
 * @param options - The options for the tokensOfOwnerIn function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { tokensOfOwnerIn } from "thirdweb/extensions/erc721";
 *
 * const result = await tokensOfOwnerIn({
 *  owner: ...,
 *  start: ...,
 *  stop: ...,
 * });
 *
 * ```
 */
export async function tokensOfOwnerIn(
  options: BaseTransactionOptions<TokensOfOwnerInParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x99a2557a",
      [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "start",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "stop",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
    ],
    params: [options.owner, options.start, options.stop],
  });
}
