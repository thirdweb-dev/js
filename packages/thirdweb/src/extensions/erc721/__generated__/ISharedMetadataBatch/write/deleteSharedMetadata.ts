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
 * Represents the parameters for the "deleteSharedMetadata" function.
 */
export type DeleteSharedMetadataParams = WithOverrides<{
  id: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "id" }>;
}>;

export const FN_SELECTOR = "0x1ebb2422" as const;
const FN_INPUTS = [
  {
    name: "id",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `deleteSharedMetadata` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `deleteSharedMetadata` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isDeleteSharedMetadataSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isDeleteSharedMetadataSupported(["0x..."]);
 * ```
 */
export function isDeleteSharedMetadataSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "deleteSharedMetadata" function.
 * @param options - The options for the deleteSharedMetadata function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeDeleteSharedMetadataParams } from "thirdweb/extensions/erc721";
 * const result = encodeDeleteSharedMetadataParams({
 *  id: ...,
 * });
 * ```
 */
export function encodeDeleteSharedMetadataParams(
  options: DeleteSharedMetadataParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.id]);
}

/**
 * Encodes the "deleteSharedMetadata" function into a Hex string with its parameters.
 * @param options - The options for the deleteSharedMetadata function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeDeleteSharedMetadata } from "thirdweb/extensions/erc721";
 * const result = encodeDeleteSharedMetadata({
 *  id: ...,
 * });
 * ```
 */
export function encodeDeleteSharedMetadata(
  options: DeleteSharedMetadataParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDeleteSharedMetadataParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "deleteSharedMetadata" function on the contract.
 * @param options - The options for the "deleteSharedMetadata" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { deleteSharedMetadata } from "thirdweb/extensions/erc721";
 *
 * const transaction = deleteSharedMetadata({
 *  contract,
 *  id: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function deleteSharedMetadata(
  options: BaseTransactionOptions<
    | DeleteSharedMetadataParams
    | {
        asyncParams: () => Promise<DeleteSharedMetadataParams>;
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
      return [resolvedOptions.id] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
