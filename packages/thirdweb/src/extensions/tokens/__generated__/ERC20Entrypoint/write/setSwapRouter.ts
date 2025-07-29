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
 * Represents the parameters for the "setSwapRouter" function.
 */
export type SetSwapRouterParams = WithOverrides<{
  swapRouter: AbiParameterToPrimitiveType<{
    type: "address";
    name: "swapRouter";
  }>;
}>;

export const FN_SELECTOR = "0x41273657" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "swapRouter",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setSwapRouter` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setSwapRouter` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isSetSwapRouterSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isSetSwapRouterSupported(["0x..."]);
 * ```
 */
export function isSetSwapRouterSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setSwapRouter" function.
 * @param options - The options for the setSwapRouter function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeSetSwapRouterParams } from "thirdweb/extensions/tokens";
 * const result = encodeSetSwapRouterParams({
 *  swapRouter: ...,
 * });
 * ```
 */
export function encodeSetSwapRouterParams(options: SetSwapRouterParams) {
  return encodeAbiParameters(FN_INPUTS, [options.swapRouter]);
}

/**
 * Encodes the "setSwapRouter" function into a Hex string with its parameters.
 * @param options - The options for the setSwapRouter function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeSetSwapRouter } from "thirdweb/extensions/tokens";
 * const result = encodeSetSwapRouter({
 *  swapRouter: ...,
 * });
 * ```
 */
export function encodeSetSwapRouter(options: SetSwapRouterParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetSwapRouterParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setSwapRouter" function on the contract.
 * @param options - The options for the "setSwapRouter" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setSwapRouter } from "thirdweb/extensions/tokens";
 *
 * const transaction = setSwapRouter({
 *  contract,
 *  swapRouter: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setSwapRouter(
  options: BaseTransactionOptions<
    | SetSwapRouterParams
    | {
        asyncParams: () => Promise<SetSwapRouterParams>;
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
      return [resolvedOptions.swapRouter] as const;
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
