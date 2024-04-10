import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "addFor" function.
 */
export type AddForParams = WithOverrides<{
  fidOwner: AbiParameterToPrimitiveType<{ type: "address"; name: "fidOwner" }>;
  keyType: AbiParameterToPrimitiveType<{ type: "uint32"; name: "keyType" }>;
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
  metadataType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "metadataType";
  }>;
  metadata: AbiParameterToPrimitiveType<{ type: "bytes"; name: "metadata" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
}>;

export const FN_SELECTOR = "0xa005d3d2" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "fidOwner",
  },
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
  {
    type: "uint256",
    name: "deadline",
  },
  {
    type: "bytes",
    name: "sig",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "addFor" function.
 * @param options - The options for the addFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeAddForParams } "thirdweb/extensions/farcaster";
 * const result = encodeAddForParams({
 *  fidOwner: ...,
 *  keyType: ...,
 *  key: ...,
 *  metadataType: ...,
 *  metadata: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeAddForParams(options: AddForParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.fidOwner,
    options.keyType,
    options.key,
    options.metadataType,
    options.metadata,
    options.deadline,
    options.sig,
  ]);
}

/**
 * Calls the "addFor" function on the contract.
 * @param options - The options for the "addFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { addFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = addFor({
 *  contract,
 *  fidOwner: ...,
 *  keyType: ...,
 *  key: ...,
 *  metadataType: ...,
 *  metadata: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function addFor(
  options: BaseTransactionOptions<
    | AddForParams
    | {
        asyncParams: () => Promise<AddForParams>;
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
        resolvedOptions.fidOwner,
        resolvedOptions.keyType,
        resolvedOptions.key,
        resolvedOptions.metadataType,
        resolvedOptions.metadata,
        resolvedOptions.deadline,
        resolvedOptions.sig,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
