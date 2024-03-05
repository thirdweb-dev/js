import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "openPack" function.
 */
export type OpenPackParams = {
  packId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "packId";
    type: "uint256";
  }>;
  amountToOpen: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "amountToOpen";
    type: "uint256";
  }>;
};

/**
 * Calls the "openPack" function on the contract.
 * @param options - The options for the "openPack" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { openPack } from "thirdweb/extensions/erc1155";
 *
 * const transaction = openPack({
 *  packId: ...,
 *  amountToOpen: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function openPack(options: BaseTransactionOptions<OpenPackParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x914e126a",
      [
        {
          internalType: "uint256",
          name: "packId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amountToOpen",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "requestId",
          type: "uint256",
        },
      ],
    ],
    params: [options.packId, options.amountToOpen],
  });
}
