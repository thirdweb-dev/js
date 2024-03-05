import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "totalSupply" function.
 */
export type TotalSupplyParams = {
  id: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "id";
    type: "uint256";
  }>;
};

/**
 * Calls the totalSupply function on the contract.
 * @param options - The options for the totalSupply function.
 * @returns The parsed result of the function call.
 * @extension IERC1155SUPPLY
 * @example
 * ```
 * import { totalSupply } from "thirdweb/extensions/IERC1155Supply";
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
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.id],
  });
}
