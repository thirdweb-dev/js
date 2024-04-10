import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "add" function.
 */
export type AddParams = WithOverrides<{
  keyType: AbiParameterToPrimitiveType<{ type: "uint32"; name: "keyType" }>;
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
  metadataType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "metadataType";
  }>;
  metadata: AbiParameterToPrimitiveType<{ type: "bytes"; name: "metadata" }>;
}>;

export const FN_SELECTOR = "0x22b1a414" as const;
const FN_INPUTS = [
  {
    type: "uint32",
    name: "keyType",
  },
  {
    type: "bytes",
    name: "key",
  },
  {
    type: "uint8",
    name: "metadataType",
  },
  {
    type: "bytes",
    name: "metadata",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "add" function.
 * @param options - The options for the add function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeAddParams } "thirdweb/extensions/farcaster";
 * const result = encodeAddParams({
 *  keyType: ...,
 *  key: ...,
 *  metadataType: ...,
 *  metadata: ...,
 * });
 * ```
 */
export function encodeAddParams(options: AddParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.keyType,
    options.key,
    options.metadataType,
    options.metadata,
  ]);
}

/**
 * Calls the "add" function on the contract.
 * @param options - The options for the "add" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { add } from "thirdweb/extensions/farcaster";
 *
 * const transaction = add({
 *  contract,
 *  keyType: ...,
 *  key: ...,
 *  metadataType: ...,
 *  metadata: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function add(
  options: BaseTransactionOptions<
    | AddParams
    | {
        asyncParams: () => Promise<AddParams>;
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
        resolvedOptions.keyType,
        resolvedOptions.key,
        resolvedOptions.metadataType,
        resolvedOptions.metadata,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
