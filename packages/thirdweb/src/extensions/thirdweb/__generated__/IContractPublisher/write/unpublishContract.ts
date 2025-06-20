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
 * Represents the parameters for the "unpublishContract" function.
 */
export type UnpublishContractParams = WithOverrides<{
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
  }>;
  contractId: AbiParameterToPrimitiveType<{
    type: "string";
    name: "contractId";
  }>;
}>;

export const FN_SELECTOR = "0x06eb56cc" as const;
const FN_INPUTS = [
  {
    name: "publisher",
    type: "address",
  },
  {
    name: "contractId",
    type: "string",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `unpublishContract` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `unpublishContract` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isUnpublishContractSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = isUnpublishContractSupported(["0x..."]);
 * ```
 */
export function isUnpublishContractSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "unpublishContract" function.
 * @param options - The options for the unpublishContract function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeUnpublishContractParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeUnpublishContractParams({
 *  publisher: ...,
 *  contractId: ...,
 * });
 * ```
 */
export function encodeUnpublishContractParams(
  options: UnpublishContractParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.publisher,
    options.contractId,
  ]);
}

/**
 * Encodes the "unpublishContract" function into a Hex string with its parameters.
 * @param options - The options for the unpublishContract function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeUnpublishContract } from "thirdweb/extensions/thirdweb";
 * const result = encodeUnpublishContract({
 *  publisher: ...,
 *  contractId: ...,
 * });
 * ```
 */
export function encodeUnpublishContract(options: UnpublishContractParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUnpublishContractParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "unpublishContract" function on the contract.
 * @param options - The options for the "unpublishContract" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { unpublishContract } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = unpublishContract({
 *  contract,
 *  publisher: ...,
 *  contractId: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function unpublishContract(
  options: BaseTransactionOptions<
    | UnpublishContractParams
    | {
        asyncParams: () => Promise<UnpublishContractParams>;
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
      return [resolvedOptions.publisher, resolvedOptions.contractId] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
