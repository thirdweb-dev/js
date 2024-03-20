import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "initialize" function.
 */

type InitializeParamsInternal = {
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
  platformFeeBps: AbiParameterToPrimitiveType<{
    type: "uint128";
    name: "_platformFeeBps";
  }>;
  platformFeeRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_platformFeeRecipient";
  }>;
};

export type InitializeParams = Prettify<
  | InitializeParamsInternal
  | {
      asyncParams: () => Promise<InitializeParamsInternal>;
    }
>;
/**
 * Calls the "initialize" function on the contract.
 * @param options - The options for the "initialize" function.
 * @returns A prepared transaction object.
 * @extension PREBUILTS
 * @example
 * ```
 * import { initialize } from "thirdweb/extensions/prebuilts";
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
 *  platformFeeBps: ...,
 *  platformFeeRecipient: ...,
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
      "0xe1591634",
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
        {
          type: "uint128",
          name: "_platformFeeBps",
        },
        {
          type: "address",
          name: "_platformFeeRecipient",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.defaultAdmin,
              resolvedParams.name,
              resolvedParams.symbol,
              resolvedParams.contractURI,
              resolvedParams.trustedForwarders,
              resolvedParams.saleRecipient,
              resolvedParams.royaltyRecipient,
              resolvedParams.royaltyBps,
              resolvedParams.platformFeeBps,
              resolvedParams.platformFeeRecipient,
            ] as const;
          }
        : [
            options.defaultAdmin,
            options.name,
            options.symbol,
            options.contractURI,
            options.trustedForwarders,
            options.saleRecipient,
            options.royaltyRecipient,
            options.royaltyBps,
            options.platformFeeBps,
            options.platformFeeRecipient,
          ],
  });
}
