import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "claim" function.
 */
export type ClaimParams = {
  receiver: AbiParameterToPrimitiveType<{ type: "address"; name: "_receiver" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  pricePerToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_pricePerToken";
  }>;
  allowlistProof: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_allowlistProof";
    components: [
      { type: "bytes32[]"; name: "proof" },
      { type: "uint256"; name: "quantityLimitPerWallet" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "address"; name: "currency" },
    ];
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
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
      "0x84bb1e42",
      [
        {
          type: "address",
          name: "_receiver",
        },
        {
          type: "uint256",
          name: "_quantity",
        },
        {
          type: "address",
          name: "_currency",
        },
        {
          type: "uint256",
          name: "_pricePerToken",
        },
        {
          type: "tuple",
          name: "_allowlistProof",
          components: [
            {
              type: "bytes32[]",
              name: "proof",
            },
            {
              type: "uint256",
              name: "quantityLimitPerWallet",
            },
            {
              type: "uint256",
              name: "pricePerToken",
            },
            {
              type: "address",
              name: "currency",
            },
          ],
        },
        {
          type: "bytes",
          name: "_data",
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
