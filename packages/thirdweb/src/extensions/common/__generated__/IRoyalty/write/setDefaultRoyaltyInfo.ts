import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "setDefaultRoyaltyInfo" function.
 */
export type SetDefaultRoyaltyInfoParams = WithOverrides<{
  royaltyRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_royaltyRecipient";
  }>;
  royaltyBps: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_royaltyBps";
  }>;
}>;

export const FN_SELECTOR = "0x600dd5ea" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_royaltyRecipient",
  },
  {
    type: "uint256",
    name: "_royaltyBps",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setDefaultRoyaltyInfo" function.
 * @param options - The options for the setDefaultRoyaltyInfo function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetDefaultRoyaltyInfoParams } "thirdweb/extensions/common";
 * const result = encodeSetDefaultRoyaltyInfoParams({
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 * ```
 */
export function encodeSetDefaultRoyaltyInfoParams(
  options: SetDefaultRoyaltyInfoParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.royaltyRecipient,
    options.royaltyBps,
  ]);
}

/**
 * Calls the "setDefaultRoyaltyInfo" function on the contract.
 * @param options - The options for the "setDefaultRoyaltyInfo" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { setDefaultRoyaltyInfo } from "thirdweb/extensions/common";
 *
 * const transaction = setDefaultRoyaltyInfo({
 *  contract,
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setDefaultRoyaltyInfo(
  options: BaseTransactionOptions<
    | SetDefaultRoyaltyInfoParams
    | {
        asyncParams: () => Promise<SetDefaultRoyaltyInfoParams>;
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
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.royaltyRecipient,
        resolvedOptions.royaltyBps,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
