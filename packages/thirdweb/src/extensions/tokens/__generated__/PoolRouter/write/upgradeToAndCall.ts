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
 * Represents the parameters for the "upgradeToAndCall" function.
 */
export type UpgradeToAndCallParams = WithOverrides<{
  newImplementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "newImplementation";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
}>;

export const FN_SELECTOR = "0x4f1ef286" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "newImplementation",
  },
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `upgradeToAndCall` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `upgradeToAndCall` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isUpgradeToAndCallSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isUpgradeToAndCallSupported(["0x..."]);
 * ```
 */
export function isUpgradeToAndCallSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "upgradeToAndCall" function.
 * @param options - The options for the upgradeToAndCall function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeUpgradeToAndCallParams } from "thirdweb/extensions/tokens";
 * const result = encodeUpgradeToAndCallParams({
 *  newImplementation: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeUpgradeToAndCallParams(options: UpgradeToAndCallParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.newImplementation,
    options.data,
  ]);
}

/**
 * Encodes the "upgradeToAndCall" function into a Hex string with its parameters.
 * @param options - The options for the upgradeToAndCall function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeUpgradeToAndCall } from "thirdweb/extensions/tokens";
 * const result = encodeUpgradeToAndCall({
 *  newImplementation: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeUpgradeToAndCall(options: UpgradeToAndCallParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUpgradeToAndCallParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "upgradeToAndCall" function on the contract.
 * @param options - The options for the "upgradeToAndCall" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { upgradeToAndCall } from "thirdweb/extensions/tokens";
 *
 * const transaction = upgradeToAndCall({
 *  contract,
 *  newImplementation: ...,
 *  data: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function upgradeToAndCall(
  options: BaseTransactionOptions<
    | UpgradeToAndCallParams
    | {
        asyncParams: () => Promise<UpgradeToAndCallParams>;
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
      return [resolvedOptions.newImplementation, resolvedOptions.data] as const;
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
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
  });
}
