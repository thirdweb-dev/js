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
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
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
  allowlistProof: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "bytes32[]"; name: "proof"; type: "bytes32[]" },
      {
        internalType: "uint256";
        name: "quantityLimitPerWallet";
        type: "uint256";
      },
      { internalType: "uint256"; name: "pricePerToken"; type: "uint256" },
      { internalType: "address"; name: "currency"; type: "address" },
    ];
    internalType: "struct IDrop1155.AllowlistProof";
    name: "allowlistProof";
    type: "tuple";
  }>;
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "data";
    type: "bytes";
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
 *  tokenId: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 *  data: ...,
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
      "0x57bc3d78",
      [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
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
          components: [
            {
              internalType: "bytes32[]",
              name: "proof",
              type: "bytes32[]",
            },
            {
              internalType: "uint256",
              name: "quantityLimitPerWallet",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "pricePerToken",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
          ],
          internalType: "struct IDrop1155.AllowlistProof",
          name: "allowlistProof",
          type: "tuple",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      [],
    ],
    params: [
      options.receiver,
      options.tokenId,
      options.quantity,
      options.currency,
      options.pricePerToken,
      options.allowlistProof,
      options.data,
    ],
  });
}
