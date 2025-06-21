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
 * Represents the parameters for the "publishContract" function.
 */
export type PublishContractParams = WithOverrides<{
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  contractId: AbiParameterToPrimitiveType<{
    type: "string";
    name: "contractId";
  }>;
  publishMetadataUri: AbiParameterToPrimitiveType<{
    type: "string";
    name: "publishMetadataUri";
  }>;
  compilerMetadataUri: AbiParameterToPrimitiveType<{
    type: "string";
    name: "compilerMetadataUri";
  }>;
  bytecodeHash: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "bytecodeHash";
  }>;
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
  }>;
}>;

export const FN_SELECTOR = "0xd50299e6" as const;
const FN_INPUTS = [
  {
    name: "publisher",
    type: "address",
  },
  {
    name: "contractId",
    type: "string",
  },
  {
    name: "publishMetadataUri",
    type: "string",
  },
  {
    name: "compilerMetadataUri",
    type: "string",
  },
  {
    name: "bytecodeHash",
    type: "bytes32",
  },
  {
    name: "implementation",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `publishContract` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `publishContract` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isPublishContractSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = isPublishContractSupported(["0x..."]);
 * ```
 */
export function isPublishContractSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "publishContract" function.
 * @param options - The options for the publishContract function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodePublishContractParams } from "thirdweb/extensions/thirdweb";
 * const result = encodePublishContractParams({
 *  publisher: ...,
 *  contractId: ...,
 *  publishMetadataUri: ...,
 *  compilerMetadataUri: ...,
 *  bytecodeHash: ...,
 *  implementation: ...,
 * });
 * ```
 */
export function encodePublishContractParams(options: PublishContractParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.publisher,
    options.contractId,
    options.publishMetadataUri,
    options.compilerMetadataUri,
    options.bytecodeHash,
    options.implementation,
  ]);
}

/**
 * Encodes the "publishContract" function into a Hex string with its parameters.
 * @param options - The options for the publishContract function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodePublishContract } from "thirdweb/extensions/thirdweb";
 * const result = encodePublishContract({
 *  publisher: ...,
 *  contractId: ...,
 *  publishMetadataUri: ...,
 *  compilerMetadataUri: ...,
 *  bytecodeHash: ...,
 *  implementation: ...,
 * });
 * ```
 */
export function encodePublishContract(options: PublishContractParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePublishContractParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "publishContract" function on the contract.
 * @param options - The options for the "publishContract" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { publishContract } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = publishContract({
 *  contract,
 *  publisher: ...,
 *  contractId: ...,
 *  publishMetadataUri: ...,
 *  compilerMetadataUri: ...,
 *  bytecodeHash: ...,
 *  implementation: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function publishContract(
  options: BaseTransactionOptions<
    | PublishContractParams
    | {
        asyncParams: () => Promise<PublishContractParams>;
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
        resolvedOptions.publisher,
        resolvedOptions.contractId,
        resolvedOptions.publishMetadataUri,
        resolvedOptions.compilerMetadataUri,
        resolvedOptions.bytecodeHash,
        resolvedOptions.implementation,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
