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
 * Represents the parameters for the "setSharedMetadata" function.
 */
export type SetSharedMetadataParams = WithOverrides<{
  metadata: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "metadata";
    components: [
      { type: "string"; name: "name" },
      { type: "string"; name: "description" },
      { type: "string"; name: "imageURI" },
      { type: "string"; name: "animationURI" },
    ];
  }>;
  id: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "id" }>;
}>;

export const FN_SELECTOR = "0x696b0c1a" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "metadata",
    components: [
      {
        type: "string",
        name: "name",
      },
      {
        type: "string",
        name: "description",
      },
      {
        type: "string",
        name: "imageURI",
      },
      {
        type: "string",
        name: "animationURI",
      },
    ],
  },
  {
    type: "bytes32",
    name: "id",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setSharedMetadata` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setSharedMetadata` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isSetSharedMetadataSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isSetSharedMetadataSupported(contract);
 * ```
 */
export async function isSetSharedMetadataSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setSharedMetadata" function.
 * @param options - The options for the setSharedMetadata function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetSharedMetadataParams } "thirdweb/extensions/erc721";
 * const result = encodeSetSharedMetadataParams({
 *  metadata: ...,
 *  id: ...,
 * });
 * ```
 */
export function encodeSetSharedMetadataParams(
  options: SetSharedMetadataParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.metadata, options.id]);
}

/**
 * Encodes the "setSharedMetadata" function into a Hex string with its parameters.
 * @param options - The options for the setSharedMetadata function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetSharedMetadata } "thirdweb/extensions/erc721";
 * const result = encodeSetSharedMetadata({
 *  metadata: ...,
 *  id: ...,
 * });
 * ```
 */
export function encodeSetSharedMetadata(options: SetSharedMetadataParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetSharedMetadataParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setSharedMetadata" function on the contract.
 * @param options - The options for the "setSharedMetadata" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { setSharedMetadata } from "thirdweb/extensions/erc721";
 *
 * const transaction = setSharedMetadata({
 *  contract,
 *  metadata: ...,
 *  id: ...,
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
export function setSharedMetadata(
  options: BaseTransactionOptions<
    | SetSharedMetadataParams
    | {
        asyncParams: () => Promise<SetSharedMetadataParams>;
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
      return [resolvedOptions.metadata, resolvedOptions.id] as const;
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
