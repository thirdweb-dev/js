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
 * Represents the parameters for the "batchMint" function.
 */
export type BatchMintParams = WithOverrides<{
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  ids: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "ids" }>;
  amounts: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "amounts" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
}>;

export const FN_SELECTOR = "0xb48ab8b6" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "to",
  },
  {
    type: "uint256[]",
    name: "ids",
  },
  {
    type: "uint256[]",
    name: "amounts",
  },
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `batchMint` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `batchMint` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isBatchMintSupported } from "thirdweb/extensions/modular";
 *
 * const supported = isBatchMintSupported(["0x..."]);
 * ```
 */
export function isBatchMintSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "batchMint" function.
 * @param options - The options for the batchMint function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBatchMintParams } "thirdweb/extensions/modular";
 * const result = encodeBatchMintParams({
 *  to: ...,
 *  ids: ...,
 *  amounts: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeBatchMintParams(options: BatchMintParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.ids,
    options.amounts,
    options.data,
  ]);
}

/**
 * Encodes the "batchMint" function into a Hex string with its parameters.
 * @param options - The options for the batchMint function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBatchMint } "thirdweb/extensions/modular";
 * const result = encodeBatchMint({
 *  to: ...,
 *  ids: ...,
 *  amounts: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeBatchMint(options: BatchMintParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBatchMintParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "batchMint" function on the contract.
 * @param options - The options for the "batchMint" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { batchMint } from "thirdweb/extensions/modular";
 *
 * const transaction = batchMint({
 *  contract,
 *  to: ...,
 *  ids: ...,
 *  amounts: ...,
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
export function batchMint(
  options: BaseTransactionOptions<
    | BatchMintParams
    | {
        asyncParams: () => Promise<BatchMintParams>;
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
        resolvedOptions.to,
        resolvedOptions.ids,
        resolvedOptions.amounts,
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
