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
      { internalType: "string"; name: "uri"; type: "string" },
      { internalType: "uint256"; name: "price"; type: "uint256" },
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
    internalType: "struct ITokenERC721.MintRequest";
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
 * @extension ERC721
 * @example
 * ```
 * import { mintWithSignature } from "thirdweb/extensions/erc721";
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
      "0x2c4510f8",
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
              internalType: "string",
              name: "uri",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "price",
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
          internalType: "struct ITokenERC721.MintRequest",
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
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.req, options.signature],
  });
}
