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
 * Represents the parameters for the "blockAndAggregate" function.
 */
export type BlockAndAggregateParams = WithOverrides<{
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

export const FN_SELECTOR = "0xc3077fa9" as const;
const FN_INPUTS = [
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
 * Checks if the `blockAndAggregate` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `blockAndAggregate` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isBlockAndAggregateSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isBlockAndAggregateSupported(contract);
 * ```
 */
export async function isBlockAndAggregateSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "blockAndAggregate" function.
 * @param options - The options for the blockAndAggregate function.
 * @returns The encoded ABI parameters.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeBlockAndAggregateParams } "thirdweb/extensions/multicall3";
 * const result = encodeBlockAndAggregateParams({
 *  calls: ...,
 * });
 * ```
 */
export function encodeBlockAndAggregateParams(
  options: BlockAndAggregateParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.calls]);
}

/**
 * Encodes the "blockAndAggregate" function into a Hex string with its parameters.
 * @param options - The options for the blockAndAggregate function.
 * @returns The encoded hexadecimal string.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeBlockAndAggregate } "thirdweb/extensions/multicall3";
 * const result = encodeBlockAndAggregate({
 *  calls: ...,
 * });
 * ```
 */
export function encodeBlockAndAggregate(options: BlockAndAggregateParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBlockAndAggregateParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "blockAndAggregate" function on the contract.
 * @param options - The options for the "blockAndAggregate" function.
 * @returns A prepared transaction object.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { blockAndAggregate } from "thirdweb/extensions/multicall3";
 *
 * const transaction = blockAndAggregate({
 *  contract,
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
export function blockAndAggregate(
  options: BaseTransactionOptions<
    | BlockAndAggregateParams
    | {
        asyncParams: () => Promise<BlockAndAggregateParams>;
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
      return [resolvedOptions.calls] as const;
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
