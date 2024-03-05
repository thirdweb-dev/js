import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "initialize" function.
 */
export type InitializeParams = {
  defaultAdmin: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_defaultAdmin";
    type: "address";
  }>;
  name: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "_name";
    type: "string";
  }>;
  symbol: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "_symbol";
    type: "string";
  }>;
  contractURI: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "_contractURI";
    type: "string";
  }>;
  trustedForwarders: AbiParameterToPrimitiveType<{
    internalType: "address[]";
    name: "_trustedForwarders";
    type: "address[]";
  }>;
  saleRecipient: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_saleRecipient";
    type: "address";
  }>;
  royaltyRecipient: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_royaltyRecipient";
    type: "address";
  }>;
  royaltyBps: AbiParameterToPrimitiveType<{
    internalType: "uint128";
    name: "_royaltyBps";
    type: "uint128";
  }>;
};

/**
 * Calls the "initialize" function on the contract.
 * @param options - The options for the "initialize" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { initialize } from "thirdweb/extensions/erc721";
 *
 * const transaction = initialize({
 *  defaultAdmin: ...,
 *  name: ...,
 *  symbol: ...,
 *  contractURI: ...,
 *  trustedForwarders: ...,
 *  saleRecipient: ...,
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function initialize(options: BaseTransactionOptions<InitializeParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x49c5c5b6",
      [
        {
          internalType: "address",
          name: "_defaultAdmin",
          type: "address",
        },
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "string",
          name: "_symbol",
          type: "string",
        },
        {
          internalType: "string",
          name: "_contractURI",
          type: "string",
        },
        {
          internalType: "address[]",
          name: "_trustedForwarders",
          type: "address[]",
        },
        {
          internalType: "address",
          name: "_saleRecipient",
          type: "address",
        },
        {
          internalType: "address",
          name: "_royaltyRecipient",
          type: "address",
        },
        {
          internalType: "uint128",
          name: "_royaltyBps",
          type: "uint128",
        },
      ],
      [],
    ],
    params: [
      options.defaultAdmin,
      options.name,
      options.symbol,
      options.contractURI,
      options.trustedForwarders,
      options.saleRecipient,
      options.royaltyRecipient,
      options.royaltyBps,
    ],
  });
}
