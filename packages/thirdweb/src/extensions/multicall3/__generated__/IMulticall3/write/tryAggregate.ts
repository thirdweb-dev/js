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
 * Represents the parameters for the "tryAggregate" function.
 */
export type TryAggregateParams = WithOverrides<{
  requireSuccess: AbiParameterToPrimitiveType<{
    type: "bool";
    name: "requireSuccess";
  }>;
  calls: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "calls";
    components: [
      { type: "address"; name: "target" },
      { type: "bytes"; name: "callData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0xbce38bd7" as const;
const FN_INPUTS = [
  {
    name: "requireSuccess",
    type: "bool",
  },
  {
    components: [
      {
        name: "target",
        type: "address",
      },
      {
        name: "callData",
        type: "bytes",
      },
    ],
    name: "calls",
    type: "tuple[]",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "success",
        type: "bool",
      },
      {
        name: "returnData",
        type: "bytes",
      },
    ],
    name: "returnData",
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `tryAggregate` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `tryAggregate` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isTryAggregateSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = isTryAggregateSupported(["0x..."]);
 * ```
 */
export function isTryAggregateSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "tryAggregate" function.
 * @param options - The options for the tryAggregate function.
 * @returns The encoded ABI parameters.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeTryAggregateParams } from "thirdweb/extensions/multicall3";
 * const result = encodeTryAggregateParams({
 *  requireSuccess: ...,
 *  calls: ...,
 * });
 * ```
 */
export function encodeTryAggregateParams(options: TryAggregateParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.requireSuccess,
    options.calls,
  ]);
}

/**
 * Encodes the "tryAggregate" function into a Hex string with its parameters.
 * @param options - The options for the tryAggregate function.
 * @returns The encoded hexadecimal string.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeTryAggregate } from "thirdweb/extensions/multicall3";
 * const result = encodeTryAggregate({
 *  requireSuccess: ...,
 *  calls: ...,
 * });
 * ```
 */
export function encodeTryAggregate(options: TryAggregateParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTryAggregateParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "tryAggregate" function on the contract.
 * @param options - The options for the "tryAggregate" function.
 * @returns A prepared transaction object.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { tryAggregate } from "thirdweb/extensions/multicall3";
 *
 * const transaction = tryAggregate({
 *  contract,
 *  requireSuccess: ...,
 *  calls: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function tryAggregate(
  options: BaseTransactionOptions<
    | TryAggregateParams
    | {
        asyncParams: () => Promise<TryAggregateParams>;
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
      return [resolvedOptions.requireSuccess, resolvedOptions.calls] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
