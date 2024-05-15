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
 * Represents the parameters for the "tryAggregate" function.
 */
export type TryAggregateParams = WithOverrides<{
  requireSuccess: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "requireSuccess";
    type: "bool";
  }>;
  calls: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "target"; type: "address" },
      { internalType: "bytes"; name: "callData"; type: "bytes" },
    ];
    internalType: "struct Multicall3.Call[]";
    name: "calls";
    type: "tuple[]";
  }>;
}>;

export const FN_SELECTOR = "0xbce38bd7" as const;
const FN_INPUTS = [
  {
    internalType: "bool",
    name: "requireSuccess",
    type: "bool",
  },
  {
    components: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "callData",
        type: "bytes",
      },
    ],
    internalType: "struct Multicall3.Call[]",
    name: "calls",
    type: "tuple[]",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "returnData",
        type: "bytes",
      },
    ],
    internalType: "struct Multicall3.Result[]",
    name: "returnData",
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `tryAggregate` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `tryAggregate` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isTryAggregateSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isTryAggregateSupported(contract);
 * ```
 */
export async function isTryAggregateSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
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
 * import { encodeTryAggregateParams } "thirdweb/extensions/multicall3";
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
 * import { encodeTryAggregate } "thirdweb/extensions/multicall3";
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
 * ...
 *
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.requireSuccess, resolvedOptions.calls] as const;
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
