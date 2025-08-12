import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "setPlatformFeeInfo" function.
 */
export type SetPlatformFeeInfoParams = WithOverrides<{
  platformFeeRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_platformFeeRecipient";
  }>;
  platformFeeBps: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_platformFeeBps";
  }>;
}>;

export const FN_SELECTOR = "0x1e7ac488" as const;
const FN_INPUTS = [
  {
    name: "_platformFeeRecipient",
    type: "address",
  },
  {
    name: "_platformFeeBps",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setPlatformFeeInfo` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setPlatformFeeInfo` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isSetPlatformFeeInfoSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isSetPlatformFeeInfoSupported(["0x..."]);
 * ```
 */
export function isSetPlatformFeeInfoSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setPlatformFeeInfo" function.
 * @param options - The options for the setPlatformFeeInfo function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeSetPlatformFeeInfoParams } from "thirdweb/extensions/marketplace";
 * const result = encodeSetPlatformFeeInfoParams({
 *  platformFeeRecipient: ...,
 *  platformFeeBps: ...,
 * });
 * ```
 */
export function encodeSetPlatformFeeInfoParams(
  options: SetPlatformFeeInfoParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.platformFeeRecipient,
    options.platformFeeBps,
  ]);
}

/**
 * Encodes the "setPlatformFeeInfo" function into a Hex string with its parameters.
 * @param options - The options for the setPlatformFeeInfo function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeSetPlatformFeeInfo } from "thirdweb/extensions/marketplace";
 * const result = encodeSetPlatformFeeInfo({
 *  platformFeeRecipient: ...,
 *  platformFeeBps: ...,
 * });
 * ```
 */
export function encodeSetPlatformFeeInfo(options: SetPlatformFeeInfoParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetPlatformFeeInfoParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setPlatformFeeInfo" function on the contract.
 * @param options - The options for the "setPlatformFeeInfo" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setPlatformFeeInfo } from "thirdweb/extensions/marketplace";
 *
 * const transaction = setPlatformFeeInfo({
 *  contract,
 *  platformFeeRecipient: ...,
 *  platformFeeBps: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setPlatformFeeInfo(
  options: BaseTransactionOptions<
    | SetPlatformFeeInfoParams
    | {
        asyncParams: () => Promise<SetPlatformFeeInfoParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
    contract: options.contract,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.platformFeeRecipient,
        resolvedOptions.platformFeeBps,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
