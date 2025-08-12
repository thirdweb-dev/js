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
 * Represents the parameters for the "remove" function.
 */
export type RemoveParams = WithOverrides<{
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
}>;

export const FN_SELECTOR = "0x58edef4c" as const;
const FN_INPUTS = [
  {
    name: "key",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `remove` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `remove` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isRemoveSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = isRemoveSupported(["0x..."]);
 * ```
 */
export function isRemoveSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "remove" function.
 * @param options - The options for the remove function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRemoveParams } from "thirdweb/extensions/farcaster";
 * const result = encodeRemoveParams({
 *  key: ...,
 * });
 * ```
 */
export function encodeRemoveParams(options: RemoveParams) {
  return encodeAbiParameters(FN_INPUTS, [options.key]);
}

/**
 * Encodes the "remove" function into a Hex string with its parameters.
 * @param options - The options for the remove function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRemove } from "thirdweb/extensions/farcaster";
 * const result = encodeRemove({
 *  key: ...,
 * });
 * ```
 */
export function encodeRemove(options: RemoveParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRemoveParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "remove" function on the contract.
 * @param options - The options for the "remove" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { remove } from "thirdweb/extensions/farcaster";
 *
 * const transaction = remove({
 *  contract,
 *  key: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function remove(
  options: BaseTransactionOptions<
    | RemoveParams
    | {
        asyncParams: () => Promise<RemoveParams>;
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
      return [resolvedOptions.key] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
