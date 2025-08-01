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
 * Represents the parameters for the "release" function.
 */
export type ReleaseParams = WithOverrides<{
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
}>;

export const FN_SELECTOR = "0x19165587" as const;
const FN_INPUTS = [
  {
    name: "account",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `release` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `release` method is supported.
 * @extension SPLIT
 * @example
 * ```ts
 * import { isReleaseSupported } from "thirdweb/extensions/split";
 *
 * const supported = isReleaseSupported(["0x..."]);
 * ```
 */
export function isReleaseSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "release" function.
 * @param options - The options for the release function.
 * @returns The encoded ABI parameters.
 * @extension SPLIT
 * @example
 * ```ts
 * import { encodeReleaseParams } from "thirdweb/extensions/split";
 * const result = encodeReleaseParams({
 *  account: ...,
 * });
 * ```
 */
export function encodeReleaseParams(options: ReleaseParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account]);
}

/**
 * Encodes the "release" function into a Hex string with its parameters.
 * @param options - The options for the release function.
 * @returns The encoded hexadecimal string.
 * @extension SPLIT
 * @example
 * ```ts
 * import { encodeRelease } from "thirdweb/extensions/split";
 * const result = encodeRelease({
 *  account: ...,
 * });
 * ```
 */
export function encodeRelease(options: ReleaseParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeReleaseParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "release" function on the contract.
 * @param options - The options for the "release" function.
 * @returns A prepared transaction object.
 * @extension SPLIT
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { release } from "thirdweb/extensions/split";
 *
 * const transaction = release({
 *  contract,
 *  account: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function release(
  options: BaseTransactionOptions<
    | ReleaseParams
    | {
        asyncParams: () => Promise<ReleaseParams>;
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
      return [resolvedOptions.account] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
