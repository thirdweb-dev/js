import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "mintWithSignature" function.
 */

type MintWithSignatureParamsInternal = {
  req: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "req";
    components: [
      { type: "address"; name: "to" },
      { type: "address"; name: "primarySaleRecipient" },
      { type: "uint256"; name: "quantity" },
      { type: "uint256"; name: "price" },
      { type: "address"; name: "currency" },
      { type: "uint128"; name: "validityStartTimestamp" },
      { type: "uint128"; name: "validityEndTimestamp" },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
};

export type MintWithSignatureParams = Prettify<
  | MintWithSignatureParamsInternal
  | {
      asyncParams: () => Promise<MintWithSignatureParamsInternal>;
    }
>;
const FN_SELECTOR = "0x8f0fefbb" as const;
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
        name: "primarySaleRecipient",
      },
      {
        type: "uint256",
        name: "quantity",
      },
      {
        type: "uint256",
        name: "price",
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
 * @extension ERC20
 * @example
 * ```
 * import { encodeMintWithSignatureParams } "thirdweb/extensions/erc20";
 * const result = encodeMintWithSignatureParams({
 *  req: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeMintWithSignatureParams(
  options: MintWithSignatureParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.req, options.signature]);
}

/**
 * Calls the "mintWithSignature" function on the contract.
 * @param options - The options for the "mintWithSignature" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { mintWithSignature } from "thirdweb/extensions/erc20";
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
