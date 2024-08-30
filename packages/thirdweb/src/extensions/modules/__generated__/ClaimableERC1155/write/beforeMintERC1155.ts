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
 * Represents the parameters for the "beforeMintERC1155" function.
 */
export type BeforeMintERC1155Params = WithOverrides<{
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "_to" }>;
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_id" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
}>;

export const FN_SELECTOR = "0x1e1dcb18" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_to",
  },
  {
    type: "uint256",
    name: "_id",
  },
  {
    type: "uint256",
    name: "_quantity",
  },
  {
    type: "bytes",
    name: "_data",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes",
  },
] as const;

/**
 * Checks if the `beforeMintERC1155` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `beforeMintERC1155` method is supported.
 * @module ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 *
 * const supported = ClaimableERC1155.isBeforeMintERC1155Supported(["0x..."]);
 * ```
 */
export function isBeforeMintERC1155Supported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "beforeMintERC1155" function.
 * @param options - The options for the beforeMintERC1155 function.
 * @returns The encoded ABI parameters.
 * @module ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 * const result = ClaimableERC1155.encodeBeforeMintERC1155Params({
 *  to: ...,
 *  id: ...,
 *  quantity: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeBeforeMintERC1155Params(
  options: BeforeMintERC1155Params,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.id,
    options.quantity,
    options.data,
  ]);
}

/**
 * Encodes the "beforeMintERC1155" function into a Hex string with its parameters.
 * @param options - The options for the beforeMintERC1155 function.
 * @returns The encoded hexadecimal string.
 * @module ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 * const result = ClaimableERC1155.encodeBeforeMintERC1155({
 *  to: ...,
 *  id: ...,
 *  quantity: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeBeforeMintERC1155(options: BeforeMintERC1155Params) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBeforeMintERC1155Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "beforeMintERC1155" function on the contract.
 * @param options - The options for the "beforeMintERC1155" function.
 * @returns A prepared transaction object.
 * @module ClaimableERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { ClaimableERC1155 } from "thirdweb/modules";
 *
 * const transaction = ClaimableERC1155.beforeMintERC1155({
 *  contract,
 *  to: ...,
 *  id: ...,
 *  quantity: ...,
 *  data: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function beforeMintERC1155(
  options: BaseTransactionOptions<
    | BeforeMintERC1155Params
    | {
        asyncParams: () => Promise<BeforeMintERC1155Params>;
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
        resolvedOptions.id,
        resolvedOptions.quantity,
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
