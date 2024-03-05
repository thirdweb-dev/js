import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "verifyClaim" function.
 */
export type VerifyClaimParams = {
  claimer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_claimer";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_tokenId";
    type: "uint256";
  }>;
  quantity: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_quantity";
    type: "uint256";
  }>;
};

/**
 * Calls the "verifyClaim" function on the contract.
 * @param options - The options for the verifyClaim function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```
 * import { verifyClaim } from "thirdweb/extensions/erc1155";
 *
 * const result = await verifyClaim({
 *  claimer: ...,
 *  tokenId: ...,
 *  quantity: ...,
 * });
 *
 * ```
 */
export async function verifyClaim(
  options: BaseTransactionOptions<VerifyClaimParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x4bbb1abf",
      [
        {
          internalType: "address",
          name: "_claimer",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.claimer, options.tokenId, options.quantity],
  });
}
