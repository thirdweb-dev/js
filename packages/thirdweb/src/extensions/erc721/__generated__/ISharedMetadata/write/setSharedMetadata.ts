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
 * Represents the parameters for the "setSharedMetadata" function.
 */
export type SetSharedMetadataParams = WithOverrides<{
  metadata: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_metadata";
    components: [
      { type: "string"; name: "name" },
      { type: "string"; name: "description" },
      { type: "string"; name: "imageURI" },
      { type: "string"; name: "animationURI" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0xa7d27d9d" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "name",
        type: "string",
      },
      {
        name: "description",
        type: "string",
      },
      {
        name: "imageURI",
        type: "string",
      },
      {
        name: "animationURI",
        type: "string",
      },
    ],
    name: "_metadata",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setSharedMetadata` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setSharedMetadata` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isSetSharedMetadataSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isSetSharedMetadataSupported(["0x..."]);
 * ```
 */
export function isSetSharedMetadataSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
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
 * import { encodeSetSharedMetadataParams } from "thirdweb/extensions/erc721";
 * const result = encodeSetSharedMetadataParams({
 *  metadata: ...,
 * });
 * ```
 */
export function encodeSetSharedMetadataParams(
  options: SetSharedMetadataParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.metadata]);
}

/**
 * Encodes the "setSharedMetadata" function into a Hex string with its parameters.
 * @param options - The options for the setSharedMetadata function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetSharedMetadata } from "thirdweb/extensions/erc721";
 * const result = encodeSetSharedMetadata({
 *  metadata: ...,
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
 * import { sendTransaction } from "thirdweb";
 * import { setSharedMetadata } from "thirdweb/extensions/erc721";
 *
 * const transaction = setSharedMetadata({
 *  contract,
 *  metadata: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
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
      return [resolvedOptions.metadata] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
