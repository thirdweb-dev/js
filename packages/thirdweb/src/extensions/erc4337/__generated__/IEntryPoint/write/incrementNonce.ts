import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "incrementNonce" function.
 */
export type IncrementNonceParams = WithOverrides<{
  key: AbiParameterToPrimitiveType<{ type: "uint192"; name: "key" }>;
}>;

export const FN_SELECTOR = "0x0bd28e3b" as const;
const FN_INPUTS = [
  {
    type: "uint192",
    name: "key",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `incrementNonce` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `incrementNonce` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isIncrementNonceSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isIncrementNonceSupported(contract);
 * ```
 */
export async function isIncrementNonceSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
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
 * import { encodeIncrementNonceParams } "thirdweb/extensions/erc4337";
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
 * import { encodeIncrementNonce } "thirdweb/extensions/erc4337";
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
 * ...
 *
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.key] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
  });
}
