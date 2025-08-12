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
 * Represents the parameters for the "createPool" function.
 */
export type CreatePoolParams = WithOverrides<{
  tokenA: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenA" }>;
  tokenB: AbiParameterToPrimitiveType<{ type: "address"; name: "tokenB" }>;
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
}>;

export const FN_SELECTOR = "0xa1671295" as const;
const FN_INPUTS = [
  {
    name: "tokenA",
    type: "address",
  },
  {
    name: "tokenB",
    type: "address",
  },
  {
    name: "fee",
    type: "uint24",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "pool",
    type: "address",
  },
] as const;

/**
 * Checks if the `createPool` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createPool` method is supported.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { isCreatePoolSupported } from "thirdweb/extensions/uniswap";
 *
 * const supported = isCreatePoolSupported(["0x..."]);
 * ```
 */
export function isCreatePoolSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createPool" function.
 * @param options - The options for the createPool function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeCreatePoolParams } from "thirdweb/extensions/uniswap";
 * const result = encodeCreatePoolParams({
 *  tokenA: ...,
 *  tokenB: ...,
 *  fee: ...,
 * });
 * ```
 */
export function encodeCreatePoolParams(options: CreatePoolParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenA,
    options.tokenB,
    options.fee,
  ]);
}

/**
 * Encodes the "createPool" function into a Hex string with its parameters.
 * @param options - The options for the createPool function.
 * @returns The encoded hexadecimal string.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeCreatePool } from "thirdweb/extensions/uniswap";
 * const result = encodeCreatePool({
 *  tokenA: ...,
 *  tokenB: ...,
 *  fee: ...,
 * });
 * ```
 */
export function encodeCreatePool(options: CreatePoolParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreatePoolParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createPool" function on the contract.
 * @param options - The options for the "createPool" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createPool } from "thirdweb/extensions/uniswap";
 *
 * const transaction = createPool({
 *  contract,
 *  tokenA: ...,
 *  tokenB: ...,
 *  fee: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function createPool(
  options: BaseTransactionOptions<
    | CreatePoolParams
    | {
        asyncParams: () => Promise<CreatePoolParams>;
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
      return [
        resolvedOptions.tokenA,
        resolvedOptions.tokenB,
        resolvedOptions.fee,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
