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
 * Represents the parameters for the "changeRecoveryAddress" function.
 */
export type ChangeRecoveryAddressParams = WithOverrides<{
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
}>;

export const FN_SELECTOR = "0xf1f0b224" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "recovery",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `changeRecoveryAddress` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `changeRecoveryAddress` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isChangeRecoveryAddressSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isChangeRecoveryAddressSupported(contract);
 * ```
 */
export async function isChangeRecoveryAddressSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "changeRecoveryAddress" function.
 * @param options - The options for the changeRecoveryAddress function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeChangeRecoveryAddressParams } "thirdweb/extensions/farcaster";
 * const result = encodeChangeRecoveryAddressParams({
 *  recovery: ...,
 * });
 * ```
 */
export function encodeChangeRecoveryAddressParams(
  options: ChangeRecoveryAddressParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.recovery]);
}

/**
 * Encodes the "changeRecoveryAddress" function into a Hex string with its parameters.
 * @param options - The options for the changeRecoveryAddress function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeChangeRecoveryAddress } "thirdweb/extensions/farcaster";
 * const result = encodeChangeRecoveryAddress({
 *  recovery: ...,
 * });
 * ```
 */
export function encodeChangeRecoveryAddress(
  options: ChangeRecoveryAddressParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeChangeRecoveryAddressParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "changeRecoveryAddress" function on the contract.
 * @param options - The options for the "changeRecoveryAddress" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { changeRecoveryAddress } from "thirdweb/extensions/farcaster";
 *
 * const transaction = changeRecoveryAddress({
 *  contract,
 *  recovery: ...,
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
export function changeRecoveryAddress(
  options: BaseTransactionOptions<
    | ChangeRecoveryAddressParams
    | {
        asyncParams: () => Promise<ChangeRecoveryAddressParams>;
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
      return [resolvedOptions.recovery] as const;
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
