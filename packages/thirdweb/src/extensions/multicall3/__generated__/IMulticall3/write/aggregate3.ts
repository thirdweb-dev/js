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
 * Represents the parameters for the "aggregate3" function.
 */
export type Aggregate3Params = WithOverrides<{
  calls: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "target"; type: "address" },
      { internalType: "bool"; name: "allowFailure"; type: "bool" },
      { internalType: "bytes"; name: "callData"; type: "bytes" },
    ];
    internalType: "struct Multicall3.Call3[]";
    name: "calls";
    type: "tuple[]";
  }>;
}>;

export const FN_SELECTOR = "0x82ad56cb" as const;
const FN_INPUTS = [
  {
    components: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "bool",
        name: "allowFailure",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "callData",
        type: "bytes",
      },
    ],
    internalType: "struct Multicall3.Call3[]",
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
 * Checks if the `aggregate3` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `aggregate3` method is supported.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { isAggregate3Supported } from "thirdweb/extensions/multicall3";
 *
 * const supported = await isAggregate3Supported(contract);
 * ```
 */
export async function isAggregate3Supported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "aggregate3" function.
 * @param options - The options for the aggregate3 function.
 * @returns The encoded ABI parameters.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeAggregate3Params } "thirdweb/extensions/multicall3";
 * const result = encodeAggregate3Params({
 *  calls: ...,
 * });
 * ```
 */
export function encodeAggregate3Params(options: Aggregate3Params) {
  return encodeAbiParameters(FN_INPUTS, [options.calls]);
}

/**
 * Encodes the "aggregate3" function into a Hex string with its parameters.
 * @param options - The options for the aggregate3 function.
 * @returns The encoded hexadecimal string.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { encodeAggregate3 } "thirdweb/extensions/multicall3";
 * const result = encodeAggregate3({
 *  calls: ...,
 * });
 * ```
 */
export function encodeAggregate3(options: Aggregate3Params) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAggregate3Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "aggregate3" function on the contract.
 * @param options - The options for the "aggregate3" function.
 * @returns A prepared transaction object.
 * @extension MULTICALL3
 * @example
 * ```ts
 * import { aggregate3 } from "thirdweb/extensions/multicall3";
 *
 * const transaction = aggregate3({
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
export function aggregate3(
  options: BaseTransactionOptions<
    | Aggregate3Params
    | {
        asyncParams: () => Promise<Aggregate3Params>;
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
