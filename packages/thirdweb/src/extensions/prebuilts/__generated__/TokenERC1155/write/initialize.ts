import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "initialize" function.
 */
export type InitializeParams = WithValue<{
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
  primarySaleRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_primarySaleRecipient";
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
}>;

export const FN_SELECTOR = "0xe1591634" as const;
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
    name: "_primarySaleRecipient",
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
 *  primarySaleRecipient: ...,
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 *  platformFeeBps: ...,
 *  platformFeeRecipient: ...,
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
    options.primarySaleRecipient,
    options.royaltyRecipient,
    options.royaltyBps,
    options.platformFeeBps,
    options.platformFeeRecipient,
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
 *  primarySaleRecipient: ...,
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
export function initialize(
  options: BaseTransactionOptions<
    | InitializeParams
    | {
        asyncParams: () => Promise<InitializeParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedParams = await asyncOptions();
      return [
        resolvedParams.defaultAdmin,
        resolvedParams.name,
        resolvedParams.symbol,
        resolvedParams.contractURI,
        resolvedParams.trustedForwarders,
        resolvedParams.primarySaleRecipient,
        resolvedParams.royaltyRecipient,
        resolvedParams.royaltyBps,
        resolvedParams.platformFeeBps,
        resolvedParams.platformFeeRecipient,
      ] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
