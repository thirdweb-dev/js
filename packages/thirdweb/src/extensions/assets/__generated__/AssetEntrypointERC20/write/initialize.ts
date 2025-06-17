import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "initialize" function.
 */
export type InitializeParams = WithOverrides<{
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "_owner" }>;
  router: AbiParameterToPrimitiveType<{ type: "address"; name: "_router" }>;
  rewardLocker: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_rewardLocker";
  }>;
}>;

export const FN_SELECTOR = "0xc0c53b8b" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_owner",
  },
  {
    type: "address",
    name: "_router",
  },
  {
    type: "address",
    name: "_rewardLocker",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `initialize` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `initialize` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isInitializeSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isInitializeSupported(["0x..."]);
 * ```
 */
export function isInitializeSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "initialize" function.
 * @param options - The options for the initialize function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeInitializeParams } from "thirdweb/extensions/assets";
 * const result = encodeInitializeParams({
 *  owner: ...,
 *  router: ...,
 *  rewardLocker: ...,
 * });
 * ```
 */
export function encodeInitializeParams(options: InitializeParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.owner,
    options.router,
    options.rewardLocker,
  ]);
}

/**
 * Encodes the "initialize" function into a Hex string with its parameters.
 * @param options - The options for the initialize function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeInitialize } from "thirdweb/extensions/assets";
 * const result = encodeInitialize({
 *  owner: ...,
 *  router: ...,
 *  rewardLocker: ...,
 * });
 * ```
 */
export function encodeInitialize(options: InitializeParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeInitializeParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "initialize" function on the contract.
 * @param options - The options for the "initialize" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { initialize } from "thirdweb/extensions/assets";
 *
 * const transaction = initialize({
 *  contract,
 *  owner: ...,
 *  router: ...,
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
export function initialize(
  options: BaseTransactionOptions<
    | InitializeParams
    | {
        asyncParams: () => Promise<InitializeParams>;
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
        resolvedOptions.owner,
        resolvedOptions.router,
        resolvedOptions.rewardLocker,
      ] as const;
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
