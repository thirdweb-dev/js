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
        name: "maxQuantityInAllowlist";
        type: "uint256";
      },
    ];
    internalType: "struct IDropERC721.AllowlistProof";
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
 * @extension ERC721
 * @example
 * ```
 * import { claim } from "thirdweb/extensions/erc721";
 *
 * const transaction = claim({
 *  receiver: ...,
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
      "0x5ab31c1a",
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
          components: [
            {
              internalType: "bytes32[]",
              name: "proof",
              type: "bytes32[]",
            },
            {
              internalType: "uint256",
              name: "maxQuantityInAllowlist",
              type: "uint256",
            },
          ],
          internalType: "struct IDropERC721.AllowlistProof",
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
      options.quantity,
      options.currency,
      options.pricePerToken,
      options.allowlistProof,
      options.data,
    ],
  });
}
