import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
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
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  proofs: AbiParameterToPrimitiveType<{
    internalType: "bytes32[]";
    name: "proofs";
    type: "bytes32[]";
  }>;
  proofMaxQuantityForWallet: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "proofMaxQuantityForWallet";
    type: "uint256";
  }>;
};

/**
 * Calls the "claim" function on the contract.
 * @param options - The options for the "claim" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { claim } from "thirdweb/extensions/erc1155";
 *
 * const transaction = claim({
 *  receiver: ...,
 *  quantity: ...,
 *  tokenId: ...,
 *  proofs: ...,
 *  proofMaxQuantityForWallet: ...,
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
      "0x38524a10",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes32[]",
          name: "proofs",
          type: "bytes32[]",
        },
        {
          internalType: "uint256",
          name: "proofMaxQuantityForWallet",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [
      options.receiver,
      options.quantity,
      options.tokenId,
      options.proofs,
      options.proofMaxQuantityForWallet,
    ],
  });
}
