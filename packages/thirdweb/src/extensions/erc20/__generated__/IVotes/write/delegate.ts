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
 * Represents the parameters for the "delegate" function.
 */
export type DelegateParams = WithOverrides<{
  delegatee: AbiParameterToPrimitiveType<{
    type: "address";
    name: "delegatee";
  }>;
}>;

export const FN_SELECTOR = "0x5c19a95c" as const;
const FN_INPUTS = [
  {
    name: "delegatee",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `delegate` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `delegate` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isDelegateSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = isDelegateSupported(["0x..."]);
 * ```
 */
export function isDelegateSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "delegate" function.
 * @param options - The options for the delegate function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeDelegateParams } from "thirdweb/extensions/erc20";
 * const result = encodeDelegateParams({
 *  delegatee: ...,
 * });
 * ```
 */
export function encodeDelegateParams(options: DelegateParams) {
  return encodeAbiParameters(FN_INPUTS, [options.delegatee]);
}

/**
 * Encodes the "delegate" function into a Hex string with its parameters.
 * @param options - The options for the delegate function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeDelegate } from "thirdweb/extensions/erc20";
 * const result = encodeDelegate({
 *  delegatee: ...,
 * });
 * ```
 */
export function encodeDelegate(options: DelegateParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDelegateParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "delegate" function on the contract.
 * @param options - The options for the "delegate" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { delegate } from "thirdweb/extensions/erc20";
 *
 * const transaction = delegate({
 *  contract,
 *  delegatee: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function delegate(
  options: BaseTransactionOptions<
    | DelegateParams
    | {
        asyncParams: () => Promise<DelegateParams>;
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
      return [resolvedOptions.delegatee] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
