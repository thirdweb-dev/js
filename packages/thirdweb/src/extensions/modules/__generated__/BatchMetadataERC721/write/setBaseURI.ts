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
 * Represents the parameters for the "setBaseURI" function.
 */
export type SetBaseURIParams = WithOverrides<{
  batchIndex: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_batchIndex";
  }>;
  baseURI: AbiParameterToPrimitiveType<{ type: "string"; name: "_baseURI" }>;
}>;

export const FN_SELECTOR = "0x33cfcb9f" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_batchIndex",
  },
  {
    type: "string",
    name: "_baseURI",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setBaseURI` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setBaseURI` method is supported.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 *
 * const supported = BatchMetadataERC721.isSetBaseURISupported(["0x..."]);
 * ```
 */
export function isSetBaseURISupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setBaseURI" function.
 * @param options - The options for the setBaseURI function.
 * @returns The encoded ABI parameters.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 * const result = BatchMetadataERC721.encodeSetBaseURIParams({
 *  batchIndex: ...,
 *  baseURI: ...,
 * });
 * ```
 */
export function encodeSetBaseURIParams(options: SetBaseURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.batchIndex, options.baseURI]);
}

/**
 * Encodes the "setBaseURI" function into a Hex string with its parameters.
 * @param options - The options for the setBaseURI function.
 * @returns The encoded hexadecimal string.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 * const result = BatchMetadataERC721.encodeSetBaseURI({
 *  batchIndex: ...,
 *  baseURI: ...,
 * });
 * ```
 */
export function encodeSetBaseURI(options: SetBaseURIParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetBaseURIParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setBaseURI" function on the contract.
 * @param options - The options for the "setBaseURI" function.
 * @returns A prepared transaction object.
 * @modules BatchMetadataERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { BatchMetadataERC721 } from "thirdweb/modules";
 *
 * const transaction = BatchMetadataERC721.setBaseURI({
 *  contract,
 *  batchIndex: ...,
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
export function setBaseURI(
  options: BaseTransactionOptions<
    | SetBaseURIParams
    | {
        asyncParams: () => Promise<SetBaseURIParams>;
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
      return [resolvedOptions.batchIndex, resolvedOptions.baseURI] as const;
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
