import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isApprovedForAll" function.
 */
export type IsApprovedForAllParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "operator" }>;
};

/**
 * Calls the "isApprovedForAll" function on the contract.
 * @param options - The options for the isApprovedForAll function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { isApprovedForAll } from "thirdweb/extensions/erc721";
 *
 * const result = await isApprovedForAll({
 *  owner: ...,
 *  operator: ...,
 * });
 *
 * ```
 */
export async function isApprovedForAll(
  options: BaseTransactionOptions<IsApprovedForAllParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xe985e9c5",
      [
        {
          type: "address",
          name: "owner",
        },
        {
          type: "address",
          name: "operator",
        },
      ],
      [
        {
          type: "bool",
        },
      ],
    ],
    params: [options.owner, options.operator],
  });
}
