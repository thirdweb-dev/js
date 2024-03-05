import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setRoyaltyInfoForToken" function.
 */
export type SetRoyaltyInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  recipient: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "recipient";
    type: "address";
  }>;
  bps: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "bps";
    type: "uint256";
  }>;
};

/**
 * Calls the "setRoyaltyInfoForToken" function on the contract.
 * @param options - The options for the "setRoyaltyInfoForToken" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { setRoyaltyInfoForToken } from "thirdweb/extensions/common";
 *
 * const transaction = setRoyaltyInfoForToken({
 *  tokenId: ...,
 *  recipient: ...,
 *  bps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setRoyaltyInfoForToken(
  options: BaseTransactionOptions<SetRoyaltyInfoForTokenParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x9bcf7a15",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "bps",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.tokenId, options.recipient, options.bps],
  });
}
