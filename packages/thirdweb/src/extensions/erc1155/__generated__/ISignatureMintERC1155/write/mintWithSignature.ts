import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "mintWithSignature" function.
 */

export type MintWithSignatureParams = {
  req: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "req";
    components: [
      { type: "address"; name: "to" },
      { type: "address"; name: "royaltyRecipient" },
      { type: "uint256"; name: "royaltyBps" },
      { type: "address"; name: "primarySaleRecipient" },
      { type: "uint256"; name: "tokenId" },
      { type: "string"; name: "uri" },
      { type: "uint256"; name: "quantity" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "address"; name: "currency" },
      { type: "uint128"; name: "validityStartTimestamp" },
      { type: "uint128"; name: "validityEndTimestamp" },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
};

export const FN_SELECTOR = "0x98a6e993" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "req",
    components: [
      {
        type: "address",
        name: "to",
      },
      {
        type: "address",
        name: "royaltyRecipient",
      },
      {
        type: "uint256",
        name: "royaltyBps",
      },
      {
        type: "address",
        name: "primarySaleRecipient",
      },
      {
        type: "uint256",
        name: "tokenId",
      },
      {
        type: "string",
        name: "uri",
      },
      {
        type: "uint256",
        name: "quantity",
      },
      {
        type: "uint256",
        name: "pricePerToken",
      },
      {
        type: "address",
        name: "currency",
      },
      {
        type: "uint128",
        name: "validityStartTimestamp",
      },
      {
        type: "uint128",
        name: "validityEndTimestamp",
      },
      {
        type: "bytes32",
        name: "uid",
      },
    ],
  },
  {
    type: "bytes",
    name: "signature",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "signer",
  },
] as const;

/**
 * Encodes the parameters for the "mintWithSignature" function.
 * @param options - The options for the mintWithSignature function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeMintWithSignatureParams } "thirdweb/extensions/erc1155";
 * const result = encodeMintWithSignatureParams({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeMintWithSignatureParams(
  options: MintWithSignatureParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.req, options.signature]);
}

/**
 * Calls the "mintWithSignature" function on the contract.
 * @param options - The options for the "mintWithSignature" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { mintWithSignature } from "thirdweb/extensions/erc1155";
 *
 * const transaction = mintWithSignature({
 *  contract,
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
  options: BaseTransactionOptions<
    | MintWithSignatureParams
    | {
        asyncParams: () => Promise<MintWithSignatureParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.req, resolvedParams.signature] as const;
          }
        : [options.req, options.signature],
  });
}
