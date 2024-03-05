import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "claim" function.
 */
export type ClaimParams = {
  receiver: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "receiver";
    type: "address";
  }>;
  quantity: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "quantity";
    type: "uint256";
  }>;
  currency: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "currency";
    type: "address";
  }>;
  pricePerToken: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "pricePerToken";
    type: "uint256";
  }>;
  proofs: AbiParameterToPrimitiveType<{
    internalType: "bytes32[]";
    name: "proofs";
    type: "bytes32[]";
  }>;
  proofMaxQuantityPerTransaction: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "proofMaxQuantityPerTransaction";
    type: "uint256";
  }>;
};

/**
 * Calls the claim function on the contract.
 * @param options - The options for the claim function.
 * @returns A prepared transaction object.
 * @extension IDROPERC20_V2
 * @example
 * ```
 * import { claim } from "thirdweb/extensions/IDropERC20_V2";
 *
 * const transaction = claim({
 *  receiver: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  proofs: ...,
 *  proofMaxQuantityPerTransaction: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claim(options: BaseTransactionOptions<ClaimParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x7a5a8e7e",
      [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "currency",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "pricePerToken",
          type: "uint256",
        },
        {
          internalType: "bytes32[]",
          name: "proofs",
          type: "bytes32[]",
        },
        {
          internalType: "uint256",
          name: "proofMaxQuantityPerTransaction",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [
      options.receiver,
      options.quantity,
      options.currency,
      options.pricePerToken,
      options.proofs,
      options.proofMaxQuantityPerTransaction,
    ],
  });
}
