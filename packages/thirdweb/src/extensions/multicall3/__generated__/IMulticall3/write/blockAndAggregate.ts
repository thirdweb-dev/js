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
 * Represents the parameters for the "blockAndAggregate" function.
 */
export type BlockAndAggregateParams = WithOverrides<{
  calls: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "calls";
    components: [
      { type: "address"; name: "target" },
      { type: "bytes"; name: "callData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0xc3077fa9" as const;
const FN_INPUTS = [
  {
    type: "tuple[]",
    name: "calls",
    components: [
      {
        type: "address",
        name: "target",
      },
      {
        type: "bytes",
        name: "callData",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "blockNumber",
  },
  {
    type: "bytes32",
    name: "blockHash",
  },
  {
    type: "tuple[]",
    name: "returnData",
    components: [
      {
        type: "bool",
        name: "success",
      },
      {
        type: "bytes",
        name: "returnData",
      },
    ],
  },
] as const;

/**
 * Checks if the `blockAndAggregate` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `blockAndAggregate` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isBlockAndAggregateSupported } from "thirdweb/extensions/multicall3";
 *
 * const supported = isBlockAndAggregateSupported(["0x..."]);
 * ```
 */
export function isBlockAndAggregateSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
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
 * import { encodeBlockAndAggregateParams } from "thirdweb/extensions/multicall3";
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
 * import { encodeBlockAndAggregate } from "thirdweb/extensions/multicall3";
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
 * import { sendTransaction } from "thirdweb";
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
 * await sendTransaction({ transaction, account });
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
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
  });
}
