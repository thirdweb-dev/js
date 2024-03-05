import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "explicitOwnershipOf" function.
 */
export type ExplicitOwnershipOfParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
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
          type: "uint256",
          name: "tokenId",
        },
      ],
      [
        {
          type: "tuple",
          name: "ownership",
          components: [
            {
              type: "address",
              name: "addr",
            },
            {
              type: "uint64",
              name: "startTimestamp",
            },
            {
              type: "bool",
              name: "burned",
            },
            {
              type: "uint24",
              name: "extraData",
            },
          ],
        },
      ],
    ],
    params: [options.tokenId],
  });
}
