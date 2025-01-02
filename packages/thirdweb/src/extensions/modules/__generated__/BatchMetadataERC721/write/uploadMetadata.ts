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
 * Represents the parameters for the "uploadMetadata" function.
 */
export type UploadMetadataParams = WithOverrides<{
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_amount" }>;
  baseURI: AbiParameterToPrimitiveType<{ type: "string"; name: "_baseURI" }>;
}>;

export const FN_SELECTOR = "0xbfa2f36e" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_amount",
  },
  {
    type: "string",
    name: "_baseURI",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `uploadMetadata` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `uploadMetadata` method is supported.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 *
 * const supported = BatchMetadataERC721.isUploadMetadataSupported(["0x..."]);
 * ```
 */
export function isUploadMetadataSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "uploadMetadata" function.
 * @param options - The options for the uploadMetadata function.
 * @returns The encoded ABI parameters.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 * const result = BatchMetadataERC721.encodeUploadMetadataParams({
 *  amount: ...,
 *  baseURI: ...,
 * });
 * ```
 */
export function encodeUploadMetadataParams(options: UploadMetadataParams) {
  return encodeAbiParameters(FN_INPUTS, [options.amount, options.baseURI]);
}

/**
 * Encodes the "uploadMetadata" function into a Hex string with its parameters.
 * @param options - The options for the uploadMetadata function.
 * @returns The encoded hexadecimal string.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 * const result = BatchMetadataERC721.encodeUploadMetadata({
 *  amount: ...,
 *  baseURI: ...,
 * });
 * ```
 */
export function encodeUploadMetadata(options: UploadMetadataParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUploadMetadataParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "uploadMetadata" function on the contract.
 * @param options - The options for the "uploadMetadata" function.
 * @returns A prepared transaction object.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 *
 * const transaction = BatchMetadataERC721.uploadMetadata({
 *  contract,
 *  amount: ...,
 *  baseURI: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function uploadMetadata(
  options: BaseTransactionOptions<
    | UploadMetadataParams
    | {
        asyncParams: () => Promise<UploadMetadataParams>;
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
      return [resolvedOptions.amount, resolvedOptions.baseURI] as const;
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
