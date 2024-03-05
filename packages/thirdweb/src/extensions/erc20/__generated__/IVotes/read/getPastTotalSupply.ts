import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getPastTotalSupply" function.
 */
export type GetPastTotalSupplyParams = {
  blockNumber: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "blockNumber";
    type: "uint256";
  }>;
};

/**
 * Calls the "getPastTotalSupply" function on the contract.
 * @param options - The options for the getPastTotalSupply function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```
 * import { getPastTotalSupply } from "thirdweb/extensions/erc20";
 *
 * const result = await getPastTotalSupply({
 *  blockNumber: ...,
 * });
 *
 * ```
 */
export async function getPastTotalSupply(
  options: BaseTransactionOptions<GetPastTotalSupplyParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x8e539e8c",
      [
        {
          internalType: "uint256",
          name: "blockNumber",
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
    params: [options.blockNumber],
  });
}
