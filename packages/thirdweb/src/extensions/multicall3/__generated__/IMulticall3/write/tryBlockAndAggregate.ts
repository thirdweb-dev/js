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
 * Represents the parameters for the "tryBlockAndAggregate" function.
 */
export type TryBlockAndAggregateParams = WithOverrides<{
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

export const FN_SELECTOR = "0x399542e9" as const;
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
    internalType: "uint256",
    name: "blockNumber",
    type: "uint256",
  },
  {
    internalType: "bytes32",
    name: "blockHash",
    type: "bytes32",
  },
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
 * Checks if the `tryBlockAndAggregate` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `tryBlockAndAggregate` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isTryBlockAndAggregateSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isTryBlockAndAggregateSupported(contract);
 * ```
 */
export async function isTryBlockAndAggregateSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "tryBlockAndAggregate" function.
 * @param options - The options for the tryBlockAndAggregate function.
 * @returns The encoded ABI parameters.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeTryBlockAndAggregateParams } "thirdweb/extensions/multicall3";
 * const result = encodeTryBlockAndAggregateParams({
 *  requireSuccess: ...,
 *  calls: ...,
 * });
 * ```
 */
export function encodeTryBlockAndAggregateParams(
  options: TryBlockAndAggregateParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.requireSuccess,
    options.calls,
  ]);
}

/**
 * Encodes the "tryBlockAndAggregate" function into a Hex string with its parameters.
 * @param options - The options for the tryBlockAndAggregate function.
 * @returns The encoded hexadecimal string.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeTryBlockAndAggregate } "thirdweb/extensions/multicall3";
 * const result = encodeTryBlockAndAggregate({
 *  requireSuccess: ...,
 *  calls: ...,
 * });
 * ```
 */
export function encodeTryBlockAndAggregate(
  options: TryBlockAndAggregateParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTryBlockAndAggregateParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "tryBlockAndAggregate" function on the contract.
 * @param options - The options for the "tryBlockAndAggregate" function.
 * @returns A prepared transaction object.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { tryBlockAndAggregate } from "thirdweb/extensions/multicall3";
 *
 * const transaction = tryBlockAndAggregate({
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
export function tryBlockAndAggregate(
  options: BaseTransactionOptions<
    | TryBlockAndAggregateParams
    | {
        asyncParams: () => Promise<TryBlockAndAggregateParams>;
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
