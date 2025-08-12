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
 * Represents the parameters for the "upgradeTo" function.
 */
export type UpgradeToParams = WithOverrides<{
  newImplementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "newImplementation";
  }>;
}>;

export const FN_SELECTOR = "0x3659cfe6" as const;
const FN_INPUTS = [
  {
    name: "newImplementation",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `upgradeTo` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `upgradeTo` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isUpgradeToSupported } from "thirdweb/extensions/erc7579";
 *
 * const supported = isUpgradeToSupported(["0x..."]);
 * ```
 */
export function isUpgradeToSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "upgradeTo" function.
 * @param options - The options for the upgradeTo function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeUpgradeToParams } from "thirdweb/extensions/erc7579";
 * const result = encodeUpgradeToParams({
 *  newImplementation: ...,
 * });
 * ```
 */
export function encodeUpgradeToParams(options: UpgradeToParams) {
  return encodeAbiParameters(FN_INPUTS, [options.newImplementation]);
}

/**
 * Encodes the "upgradeTo" function into a Hex string with its parameters.
 * @param options - The options for the upgradeTo function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeUpgradeTo } from "thirdweb/extensions/erc7579";
 * const result = encodeUpgradeTo({
 *  newImplementation: ...,
 * });
 * ```
 */
export function encodeUpgradeTo(options: UpgradeToParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUpgradeToParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "upgradeTo" function on the contract.
 * @param options - The options for the "upgradeTo" function.
 * @returns A prepared transaction object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { upgradeTo } from "thirdweb/extensions/erc7579";
 *
 * const transaction = upgradeTo({
 *  contract,
 *  newImplementation: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function upgradeTo(
  options: BaseTransactionOptions<
    | UpgradeToParams
    | {
        asyncParams: () => Promise<UpgradeToParams>;
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
      return [resolvedOptions.newImplementation] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
