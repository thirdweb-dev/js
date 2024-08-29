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
 * Represents the parameters for the "relay" function.
 */
export type RelayParams = WithOverrides<{
  target: AbiParameterToPrimitiveType<{ type: "address"; name: "target" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
}>;

export const FN_SELECTOR = "0xc28bc2fa" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "target",
  },
  {
    type: "uint256",
    name: "value",
  },
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `relay` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `relay` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isRelaySupported } from "thirdweb/extensions/vote";
 *
 * const supported = isRelaySupported(["0x..."]);
 * ```
 */
export function isRelaySupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "relay" function.
 * @param options - The options for the relay function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeRelayParams } "thirdweb/extensions/vote";
 * const result = encodeRelayParams({
 *  target: ...,
 *  value: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeRelayParams(options: RelayParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.target,
    options.value,
    options.data,
  ]);
}

/**
 * Encodes the "relay" function into a Hex string with its parameters.
 * @param options - The options for the relay function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeRelay } "thirdweb/extensions/vote";
 * const result = encodeRelay({
 *  target: ...,
 *  value: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeRelay(options: RelayParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRelayParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "relay" function on the contract.
 * @param options - The options for the "relay" function.
 * @returns A prepared transaction object.
 * @extension VOTE
 * @example
 * ```ts
 * import { relay } from "thirdweb/extensions/vote";
 *
 * const transaction = relay({
 *  contract,
 *  target: ...,
 *  value: ...,
 *  data: ...,
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
export function relay(
  options: BaseTransactionOptions<
    | RelayParams
    | {
        asyncParams: () => Promise<RelayParams>;
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
        resolvedOptions.target,
        resolvedOptions.value,
        resolvedOptions.data,
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
  });
}
