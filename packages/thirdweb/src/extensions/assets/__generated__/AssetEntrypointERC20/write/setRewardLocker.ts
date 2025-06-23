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
 * Represents the parameters for the "setRewardLocker" function.
 */
export type SetRewardLockerParams = WithOverrides<{
  rewardLocker: AbiParameterToPrimitiveType<{
    type: "address";
    name: "rewardLocker";
  }>;
}>;

export const FN_SELECTOR = "0xeb7fb197" as const;
const FN_INPUTS = [
  {
    name: "rewardLocker",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setRewardLocker` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setRewardLocker` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isSetRewardLockerSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isSetRewardLockerSupported(["0x..."]);
 * ```
 */
export function isSetRewardLockerSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setRewardLocker" function.
 * @param options - The options for the setRewardLocker function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeSetRewardLockerParams } from "thirdweb/extensions/assets";
 * const result = encodeSetRewardLockerParams({
 *  rewardLocker: ...,
 * });
 * ```
 */
export function encodeSetRewardLockerParams(options: SetRewardLockerParams) {
  return encodeAbiParameters(FN_INPUTS, [options.rewardLocker]);
}

/**
 * Encodes the "setRewardLocker" function into a Hex string with its parameters.
 * @param options - The options for the setRewardLocker function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeSetRewardLocker } from "thirdweb/extensions/assets";
 * const result = encodeSetRewardLocker({
 *  rewardLocker: ...,
 * });
 * ```
 */
export function encodeSetRewardLocker(options: SetRewardLockerParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetRewardLockerParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setRewardLocker" function on the contract.
 * @param options - The options for the "setRewardLocker" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setRewardLocker } from "thirdweb/extensions/assets";
 *
 * const transaction = setRewardLocker({
 *  contract,
 *  rewardLocker: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setRewardLocker(
  options: BaseTransactionOptions<
    | SetRewardLockerParams
    | {
        asyncParams: () => Promise<SetRewardLockerParams>;
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
      return [resolvedOptions.rewardLocker] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
