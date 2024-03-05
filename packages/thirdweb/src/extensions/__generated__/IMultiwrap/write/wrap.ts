import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "wrap" function.
 */
export type WrapParams = {
  wrappedContents: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "assetContract"; type: "address" },
      {
        internalType: "enum ITokenBundle.TokenType";
        name: "tokenType";
        type: "uint8";
      },
      { internalType: "uint256"; name: "tokenId"; type: "uint256" },
      { internalType: "uint256"; name: "totalAmount"; type: "uint256" },
    ];
    internalType: "struct ITokenBundle.Token[]";
    name: "wrappedContents";
    type: "tuple[]";
  }>;
  uriForWrappedToken: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "uriForWrappedToken";
    type: "string";
  }>;
  recipient: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "recipient";
    type: "address";
  }>;
};

/**
 * Calls the wrap function on the contract.
 * @param options - The options for the wrap function.
 * @returns A prepared transaction object.
 * @extension IMULTIWRAP
 * @example
 * ```
 * import { wrap } from "thirdweb/extensions/IMultiwrap";
 *
 * const transaction = wrap({
 *  wrappedContents: ...,
 *  uriForWrappedToken: ...,
 *  recipient: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function wrap(options: BaseTransactionOptions<WrapParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x29e471dd",
      [
        {
          components: [
            {
              internalType: "address",
              name: "assetContract",
              type: "address",
            },
            {
              internalType: "enum ITokenBundle.TokenType",
              name: "tokenType",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
          ],
          internalType: "struct ITokenBundle.Token[]",
          name: "wrappedContents",
          type: "tuple[]",
        },
        {
          internalType: "string",
          name: "uriForWrappedToken",
          type: "string",
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
    ],
    params: [
      options.wrappedContents,
      options.uriForWrappedToken,
      options.recipient,
    ],
  });
}
