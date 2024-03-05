import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getSupplyClaimedByWallet" function.
 */
export type GetSupplyClaimedByWalletParams = {
  conditionId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_conditionId";
    type: "uint256";
  }>;
  claimer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_claimer";
    type: "address";
  }>;
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
          internalType: "uint256",
          name: "_conditionId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_claimer",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "supplyClaimedByWallet",
          type: "uint256",
        },
      ],
    ],
    params: [options.conditionId, options.claimer],
  });
}
