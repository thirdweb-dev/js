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
 * Represents the parameters for the "incrementNonce" function.
 */
export type IncrementNonceParams = WithOverrides<{
  key: AbiParameterToPrimitiveType<{ type: "uint192"; name: "key" }>;
}>;

export const FN_SELECTOR = "0x0bd28e3b" as const;
const FN_INPUTS = [
  {
    name: "key",
    type: "uint192",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `incrementNonce` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `incrementNonce` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isIncrementNonceSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isIncrementNonceSupported(["0x..."]);
 * ```
 */
export function isIncrementNonceSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "incrementNonce" function.
 * @param options - The options for the incrementNonce function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeIncrementNonceParams } from "thirdweb/extensions/erc4337";
 * const result = encodeIncrementNonceParams({
 *  key: ...,
 * });
 * ```
 */
export function encodeIncrementNonceParams(options: IncrementNonceParams) {
  return encodeAbiParameters(FN_INPUTS, [options.key]);
}

/**
 * Encodes the "incrementNonce" function into a Hex string with its parameters.
 * @param options - The options for the incrementNonce function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeIncrementNonce } from "thirdweb/extensions/erc4337";
 * const result = encodeIncrementNonce({
 *  key: ...,
 * });
 * ```
 */
export function encodeIncrementNonce(options: IncrementNonceParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIncrementNonceParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "incrementNonce" function on the contract.
 * @param options - The options for the "incrementNonce" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { incrementNonce } from "thirdweb/extensions/erc4337";
 *
 * const transaction = incrementNonce({
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
export function incrementNonce(
  options: BaseTransactionOptions<
    | IncrementNonceParams
    | {
        asyncParams: () => Promise<IncrementNonceParams>;
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
