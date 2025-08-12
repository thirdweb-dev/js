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
    components: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "recovery",
        type: "address",
      },
      {
        name: "deadline",
        type: "uint256",
      },
      {
        name: "sig",
        type: "bytes",
      },
    ],
    name: "registerParams",
    type: "tuple",
  },
  {
    components: [
      {
        name: "keyType",
        type: "uint32",
      },
      {
        name: "key",
        type: "bytes",
      },
      {
        name: "metadataType",
        type: "uint8",
      },
      {
        name: "metadata",
        type: "bytes",
      },
      {
        name: "deadline",
        type: "uint256",
      },
      {
        name: "sig",
        type: "bytes",
      },
    ],
    name: "signerParams",
    type: "tuple[]",
  },
  {
    name: "extraStorage",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "fid",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `register` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `register` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isRegisterSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = isRegisterSupported(["0x..."]);
 * ```
 */
export function isRegisterSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "register" function.
 * @param options - The options for the register function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRegisterParams } from "thirdweb/extensions/farcaster";
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
 * Encodes the "register" function into a Hex string with its parameters.
 * @param options - The options for the register function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRegister } from "thirdweb/extensions/farcaster";
 * const result = encodeRegister({
 *  registerParams: ...,
 *  signerParams: ...,
 *  extraStorage: ...,
 * });
 * ```
 */
export function encodeRegister(options: RegisterParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRegisterParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "register" function on the contract.
 * @param options - The options for the "register" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { register } from "thirdweb/extensions/farcaster";
 *
 * const transaction = register({
 *  contract,
 *  registerParams: ...,
 *  signerParams: ...,
 *  extraStorage: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
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
        resolvedOptions.registerParams,
        resolvedOptions.signerParams,
        resolvedOptions.extraStorage,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
