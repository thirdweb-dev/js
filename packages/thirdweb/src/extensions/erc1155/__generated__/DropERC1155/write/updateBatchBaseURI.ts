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
 * Represents the parameters for the "updateBatchBaseURI" function.
 */
export type UpdateBatchBaseURIParams = WithOverrides<{
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_index" }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "_uri" }>;
}>;

export const FN_SELECTOR = "0xde903ddd" as const;
const FN_INPUTS = [
  {
    name: "_index",
    type: "uint256",
  },
  {
    name: "_uri",
    type: "string",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `updateBatchBaseURI` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `updateBatchBaseURI` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isUpdateBatchBaseURISupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isUpdateBatchBaseURISupported(["0x..."]);
 * ```
 */
export function isUpdateBatchBaseURISupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "updateBatchBaseURI" function.
 * @param options - The options for the updateBatchBaseURI function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeUpdateBatchBaseURIParams } from "thirdweb/extensions/erc1155";
 * const result = encodeUpdateBatchBaseURIParams({
 *  index: ...,
 *  uri: ...,
 * });
 * ```
 */
export function encodeUpdateBatchBaseURIParams(
  options: UpdateBatchBaseURIParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.index, options.uri]);
}

/**
 * Encodes the "updateBatchBaseURI" function into a Hex string with its parameters.
 * @param options - The options for the updateBatchBaseURI function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeUpdateBatchBaseURI } from "thirdweb/extensions/erc1155";
 * const result = encodeUpdateBatchBaseURI({
 *  index: ...,
 *  uri: ...,
 * });
 * ```
 */
export function encodeUpdateBatchBaseURI(options: UpdateBatchBaseURIParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUpdateBatchBaseURIParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "updateBatchBaseURI" function on the contract.
 * @param options - The options for the "updateBatchBaseURI" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { updateBatchBaseURI } from "thirdweb/extensions/erc1155";
 *
 * const transaction = updateBatchBaseURI({
 *  contract,
 *  index: ...,
 *  uri: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function updateBatchBaseURI(
  options: BaseTransactionOptions<
    | UpdateBatchBaseURIParams
    | {
        asyncParams: () => Promise<UpdateBatchBaseURIParams>;
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
      return [resolvedOptions.index, resolvedOptions.uri] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
