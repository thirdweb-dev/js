import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "totalSupply" function.
 */
export type TotalSupplyParams = {
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "id" }>;
};

/**
 * Calls the "totalSupply" function on the contract.
 * @param options - The options for the totalSupply function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```
 * import { totalSupply } from "thirdweb/extensions/erc1155";
 *
 * const result = await totalSupply({
 *  id: ...,
 * });
 *
 * ```
 */
export async function totalSupply(
  options: BaseTransactionOptions<TotalSupplyParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xbd85b039",
      [
        {
          type: "uint256",
          name: "id",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.id],
  });
}
