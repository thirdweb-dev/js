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
 * Represents the parameters for the "addExtension" function.
 */
export type AddExtensionParams = WithOverrides<{
  extension: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "extension";
    components: [
      {
        type: "tuple";
        name: "metadata";
        components: [
          { type: "string"; name: "name" },
          { type: "string"; name: "metadataURI" },
          { type: "address"; name: "implementation" },
        ];
      },
      {
        type: "tuple[]";
        name: "functions";
        components: [
          { type: "bytes4"; name: "functionSelector" },
          { type: "string"; name: "functionSignature" },
        ];
      },
    ];
  }>;
}>;

export const FN_SELECTOR = "0xe05688fe" as const;
const FN_INPUTS = [
  {
    components: [
      {
        components: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "metadataURI",
            type: "string",
          },
          {
            name: "implementation",
            type: "address",
          },
        ],
        name: "metadata",
        type: "tuple",
      },
      {
        components: [
          {
            name: "functionSelector",
            type: "bytes4",
          },
          {
            name: "functionSignature",
            type: "string",
          },
        ],
        name: "functions",
        type: "tuple[]",
      },
    ],
    name: "extension",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `addExtension` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `addExtension` method is supported.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { isAddExtensionSupported } from "thirdweb/extensions/dynamic-contracts";
 *
 * const supported = isAddExtensionSupported(["0x..."]);
 * ```
 */
export function isAddExtensionSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "addExtension" function.
 * @param options - The options for the addExtension function.
 * @returns The encoded ABI parameters.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { encodeAddExtensionParams } from "thirdweb/extensions/dynamic-contracts";
 * const result = encodeAddExtensionParams({
 *  extension: ...,
 * });
 * ```
 */
export function encodeAddExtensionParams(options: AddExtensionParams) {
  return encodeAbiParameters(FN_INPUTS, [options.extension]);
}

/**
 * Encodes the "addExtension" function into a Hex string with its parameters.
 * @param options - The options for the addExtension function.
 * @returns The encoded hexadecimal string.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { encodeAddExtension } from "thirdweb/extensions/dynamic-contracts";
 * const result = encodeAddExtension({
 *  extension: ...,
 * });
 * ```
 */
export function encodeAddExtension(options: AddExtensionParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAddExtensionParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "addExtension" function on the contract.
 * @param options - The options for the "addExtension" function.
 * @returns A prepared transaction object.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { addExtension } from "thirdweb/extensions/dynamic-contracts";
 *
 * const transaction = addExtension({
 *  contract,
 *  extension: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function addExtension(
  options: BaseTransactionOptions<
    | AddExtensionParams
    | {
        asyncParams: () => Promise<AddExtensionParams>;
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
      return [resolvedOptions.extension] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
