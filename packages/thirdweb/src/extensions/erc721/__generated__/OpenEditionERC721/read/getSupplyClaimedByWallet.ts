import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getSupplyClaimedByWallet" function.
 */
export type GetSupplyClaimedByWalletParams = {
  conditionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_conditionId";
  }>;
  claimer: AbiParameterToPrimitiveType<{ type: "address"; name: "_claimer" }>;
};

/**
 * Calls the "getSupplyClaimedByWallet" function on the contract.
 * @param options - The options for the getSupplyClaimedByWallet function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { getSupplyClaimedByWallet } from "thirdweb/extensions/erc721";
 *
 * const result = await getSupplyClaimedByWallet({
 *  conditionId: ...,
 *  claimer: ...,
 * });
 *
 * ```
 */
export async function getSupplyClaimedByWallet(
  options: BaseTransactionOptions<GetSupplyClaimedByWalletParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xad1eefc5",
      [
        {
          type: "uint256",
          name: "_conditionId",
        },
        {
          type: "address",
          name: "_claimer",
        },
      ],
      [
        {
          type: "uint256",
          name: "supplyClaimedByWallet",
        },
      ],
    ],
    params: [options.conditionId, options.claimer],
  });
}
