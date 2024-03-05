import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "openPackAndClaimRewards" function.
 */
export type OpenPackAndClaimRewardsParams = {
  packId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_packId";
    type: "uint256";
  }>;
  amountToOpen: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_amountToOpen";
    type: "uint256";
  }>;
  callBackGasLimit: AbiParameterToPrimitiveType<{
    internalType: "uint32";
    name: "_callBackGasLimit";
    type: "uint32";
  }>;
};

/**
 * Calls the "openPackAndClaimRewards" function on the contract.
 * @param options - The options for the "openPackAndClaimRewards" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { openPackAndClaimRewards } from "thirdweb/extensions/erc1155";
 *
 * const transaction = openPackAndClaimRewards({
 *  packId: ...,
 *  amountToOpen: ...,
 *  callBackGasLimit: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function openPackAndClaimRewards(
  options: BaseTransactionOptions<OpenPackAndClaimRewardsParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xac296b3f",
      [
        {
          internalType: "uint256",
          name: "_packId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_amountToOpen",
          type: "uint256",
        },
        {
          internalType: "uint32",
          name: "_callBackGasLimit",
          type: "uint32",
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
    params: [options.packId, options.amountToOpen, options.callBackGasLimit],
  });
}
