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
 * Represents the parameters for the "lazyMint" function.
 */
export type LazyMintParams = WithOverrides<{
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
  baseURIForTokens: AbiParameterToPrimitiveType<{
    type: "string";
    name: "baseURIForTokens";
  }>;
  extraData: AbiParameterToPrimitiveType<{ type: "bytes"; name: "extraData" }>;
}>;

export const FN_SELECTOR = "0xd37c353b" as const;
const FN_INPUTS = [
  {
    name: "amount",
    type: "uint256",
  },
  {
    name: "baseURIForTokens",
    type: "string",
  },
  {
    name: "extraData",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "batchId",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `lazyMint` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `lazyMint` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isLazyMintSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isLazyMintSupported(["0x..."]);
 * ```
 */
export function isLazyMintSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "lazyMint" function.
 * @param options - The options for the lazyMint function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeLazyMintParams } from "thirdweb/extensions/erc1155";
 * const result = encodeLazyMintParams({
 *  amount: ...,
 *  baseURIForTokens: ...,
 *  extraData: ...,
 * });
 * ```
 */
export function encodeLazyMintParams(options: LazyMintParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.amount,
    options.baseURIForTokens,
    options.extraData,
  ]);
}

/**
 * Encodes the "lazyMint" function into a Hex string with its parameters.
 * @param options - The options for the lazyMint function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeLazyMint } from "thirdweb/extensions/erc1155";
 * const result = encodeLazyMint({
 *  amount: ...,
 *  baseURIForTokens: ...,
 *  extraData: ...,
 * });
 * ```
 */
export function encodeLazyMint(options: LazyMintParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeLazyMintParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "lazyMint" function on the contract.
 * @param options - The options for the "lazyMint" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { lazyMint } from "thirdweb/extensions/erc1155";
 *
 * const transaction = lazyMint({
 *  contract,
 *  amount: ...,
 *  baseURIForTokens: ...,
 *  extraData: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function lazyMint(
  options: BaseTransactionOptions<
    | LazyMintParams
    | {
        asyncParams: () => Promise<LazyMintParams>;
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
        resolvedOptions.amount,
        resolvedOptions.baseURIForTokens,
        resolvedOptions.extraData,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
