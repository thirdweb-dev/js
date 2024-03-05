import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "mintWithSignature" function.
 */
export type MintWithSignatureParams = {
  req: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "to"; type: "address" },
      { internalType: "address"; name: "royaltyRecipient"; type: "address" },
      { internalType: "uint256"; name: "royaltyBps"; type: "uint256" },
      {
        internalType: "address";
        name: "primarySaleRecipient";
        type: "address";
      },
      { internalType: "uint256"; name: "tokenId"; type: "uint256" },
      { internalType: "string"; name: "uri"; type: "string" },
      { internalType: "uint256"; name: "quantity"; type: "uint256" },
      { internalType: "uint256"; name: "pricePerToken"; type: "uint256" },
      { internalType: "address"; name: "currency"; type: "address" },
      {
        internalType: "uint128";
        name: "validityStartTimestamp";
        type: "uint128";
      },
      {
        internalType: "uint128";
        name: "validityEndTimestamp";
        type: "uint128";
      },
      { internalType: "bytes32"; name: "uid"; type: "bytes32" },
    ];
    internalType: "struct ISignatureMintERC1155.MintRequest";
    name: "req";
    type: "tuple";
  }>;
  signature: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "signature";
    type: "bytes";
  }>;
};

/**
 * Calls the "mintWithSignature" function on the contract.
 * @param options - The options for the "mintWithSignature" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { mintWithSignature } from "thirdweb/extensions/erc1155";
 *
 * const transaction = mintWithSignature({
 *  req: ...,
 *  signature: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mintWithSignature(
  options: BaseTransactionOptions<MintWithSignatureParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x98a6e993",
      [
        {
          components: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "address",
              name: "royaltyRecipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "royaltyBps",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "primarySaleRecipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "uri",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "quantity",
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
            {
              internalType: "uint128",
              name: "validityStartTimestamp",
              type: "uint128",
            },
            {
              internalType: "uint128",
              name: "validityEndTimestamp",
              type: "uint128",
            },
            {
              internalType: "bytes32",
              name: "uid",
              type: "bytes32",
            },
          ],
          internalType: "struct ISignatureMintERC1155.MintRequest",
          name: "req",
          type: "tuple",
        },
        {
          internalType: "bytes",
          name: "signature",
          type: "bytes",
        },
      ],
      [
        {
          internalType: "address",
          name: "signer",
          type: "address",
        },
      ],
    ],
    params: [options.req, options.signature],
  });
}
