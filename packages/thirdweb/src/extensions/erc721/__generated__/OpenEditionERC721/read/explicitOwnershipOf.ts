import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "explicitOwnershipOf" function.
 */
export type ExplicitOwnershipOfParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "explicitOwnershipOf" function on the contract.
 * @param options - The options for the explicitOwnershipOf function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { explicitOwnershipOf } from "thirdweb/extensions/erc721";
 *
 * const result = await explicitOwnershipOf({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function explicitOwnershipOf(
  options: BaseTransactionOptions<ExplicitOwnershipOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc23dc68f",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      [
        {
          components: [
            {
              internalType: "address",
              name: "addr",
              type: "address",
            },
            {
              internalType: "uint64",
              name: "startTimestamp",
              type: "uint64",
            },
            {
              internalType: "bool",
              name: "burned",
              type: "bool",
            },
            {
              internalType: "uint24",
              name: "extraData",
              type: "uint24",
            },
          ],
          internalType: "struct IERC721AUpgradeable.TokenOwnership",
          name: "ownership",
          type: "tuple",
        },
      ],
    ],
    params: [options.tokenId],
  });
}
