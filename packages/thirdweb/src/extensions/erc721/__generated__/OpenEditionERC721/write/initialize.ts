import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "initialize" function.
 */
export type InitializeParams = {
  defaultAdmin: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_defaultAdmin";
  }>;
  name: AbiParameterToPrimitiveType<{ type: "string"; name: "_name" }>;
  symbol: AbiParameterToPrimitiveType<{ type: "string"; name: "_symbol" }>;
  contractURI: AbiParameterToPrimitiveType<{
    type: "string";
    name: "_contractURI";
  }>;
  trustedForwarders: AbiParameterToPrimitiveType<{
    type: "address[]";
    name: "_trustedForwarders";
  }>;
  saleRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_saleRecipient";
  }>;
  royaltyRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_royaltyRecipient";
  }>;
  royaltyBps: AbiParameterToPrimitiveType<{
    type: "uint128";
    name: "_royaltyBps";
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
          type: "address",
          name: "_defaultAdmin",
        },
        {
          type: "string",
          name: "_name",
        },
        {
          type: "string",
          name: "_symbol",
        },
        {
          type: "string",
          name: "_contractURI",
        },
        {
          type: "address[]",
          name: "_trustedForwarders",
        },
        {
          type: "address",
          name: "_saleRecipient",
        },
        {
          type: "address",
          name: "_royaltyRecipient",
        },
        {
          type: "uint128",
          name: "_royaltyBps",
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
