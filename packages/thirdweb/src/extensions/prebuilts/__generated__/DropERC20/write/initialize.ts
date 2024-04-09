import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

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
  platformFeeRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_platformFeeRecipient";
  }>;
  platformFeeBps: AbiParameterToPrimitiveType<{
    type: "uint128";
    name: "_platformFeeBps";
  }>;
};

export const FN_SELECTOR = "0x49c5c5b6" as const;
const FN_INPUTS = [
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
    name: "_platformFeeRecipient",
  },
  {
    type: "uint128",
    name: "_platformFeeBps",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "initialize" function.
 * @param options - The options for the initialize function.
 * @returns The encoded ABI parameters.
 * @extension PREBUILTS
 * @example
 * ```ts
 * import { encodeInitializeParams } "thirdweb/extensions/prebuilts";
 * const result = encodeInitializeParams({
 *  defaultAdmin: ...,
 *  name: ...,
 *  symbol: ...,
 *  contractURI: ...,
 *  trustedForwarders: ...,
 *  saleRecipient: ...,
 *  platformFeeRecipient: ...,
 *  platformFeeBps: ...,
 * });
 * ```
 */
export function encodeInitializeParams(options: InitializeParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.defaultAdmin,
    options.name,
    options.symbol,
    options.contractURI,
    options.trustedForwarders,
    options.saleRecipient,
    options.platformFeeRecipient,
    options.platformFeeBps,
  ]);
}

/**
 * Calls the "initialize" function on the contract.
 * @param options - The options for the "initialize" function.
 * @returns A prepared transaction object.
 * @extension PREBUILTS
 * @example
 * ```ts
 * import { initialize } from "thirdweb/extensions/prebuilts";
 *
 * const transaction = initialize({
 *  contract,
 *  defaultAdmin: ...,
 *  name: ...,
 *  symbol: ...,
 *  contractURI: ...,
 *  trustedForwarders: ...,
 *  saleRecipient: ...,
 *  platformFeeRecipient: ...,
 *  platformFeeBps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function initialize(
  options: BaseTransactionOptions<
    | InitializeParams
    | {
        asyncParams: () => Promise<InitializeParams>;
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
            return [
              resolvedParams.defaultAdmin,
              resolvedParams.name,
              resolvedParams.symbol,
              resolvedParams.contractURI,
              resolvedParams.trustedForwarders,
              resolvedParams.saleRecipient,
              resolvedParams.platformFeeRecipient,
              resolvedParams.platformFeeBps,
            ] as const;
          }
        : [
            options.defaultAdmin,
            options.name,
            options.symbol,
            options.contractURI,
            options.trustedForwarders,
            options.saleRecipient,
            options.platformFeeRecipient,
            options.platformFeeBps,
          ],
  });
}
