import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "register" function.
 */
export type RegisterParams = WithOverrides<{
  registerParams: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "registerParams";
    components: [
      { type: "address"; name: "to" },
      { type: "address"; name: "recovery" },
      { type: "uint256"; name: "deadline" },
      { type: "bytes"; name: "sig" },
    ];
  }>;
  signerParams: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "signerParams";
    components: [
      { type: "uint32"; name: "keyType" },
      { type: "bytes"; name: "key" },
      { type: "uint8"; name: "metadataType" },
      { type: "bytes"; name: "metadata" },
      { type: "uint256"; name: "deadline" },
      { type: "bytes"; name: "sig" },
    ];
  }>;
  extraStorage: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "extraStorage";
  }>;
}>;

export const FN_SELECTOR = "0xa44c9ce7" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "registerParams",
    components: [
      {
        type: "address",
        name: "to",
      },
      {
        type: "address",
        name: "recovery",
      },
      {
        type: "uint256",
        name: "deadline",
      },
      {
        type: "bytes",
        name: "sig",
      },
    ],
  },
  {
    type: "tuple[]",
    name: "signerParams",
    components: [
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
    ],
  },
  {
    type: "uint256",
    name: "extraStorage",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
] as const;

/**
 * Encodes the parameters for the "register" function.
 * @param options - The options for the register function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRegisterParams } "thirdweb/extensions/farcaster";
 * const result = encodeRegisterParams({
 *  registerParams: ...,
 *  signerParams: ...,
 *  extraStorage: ...,
 * });
 * ```
 */
export function encodeRegisterParams(options: RegisterParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.registerParams,
    options.signerParams,
    options.extraStorage,
  ]);
}

/**
 * Calls the "register" function on the contract.
 * @param options - The options for the "register" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { register } from "thirdweb/extensions/farcaster";
 *
 * const transaction = register({
 *  contract,
 *  registerParams: ...,
 *  signerParams: ...,
 *  extraStorage: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function register(
  options: BaseTransactionOptions<
    | RegisterParams
    | {
        asyncParams: () => Promise<RegisterParams>;
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
        resolvedOptions.registerParams,
        resolvedOptions.signerParams,
        resolvedOptions.extraStorage,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
