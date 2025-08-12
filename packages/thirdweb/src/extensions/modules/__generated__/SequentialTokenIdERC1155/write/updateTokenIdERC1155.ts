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
 * Represents the parameters for the "updateTokenIdERC1155" function.
 */
export type UpdateTokenIdERC1155Params = WithOverrides<{
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
}>;

export const FN_SELECTOR = "0x034eb4dd" as const;
const FN_INPUTS = [
  {
    name: "_tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `updateTokenIdERC1155` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `updateTokenIdERC1155` method is supported.
 * @modules SequentialTokenIdERC1155
 * @example
 * ```ts
 * import { SequentialTokenIdERC1155 } from "thirdweb/modules";
 *
 * const supported = SequentialTokenIdERC1155.isUpdateTokenIdERC1155Supported(["0x..."]);
 * ```
 */
export function isUpdateTokenIdERC1155Supported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "updateTokenIdERC1155" function.
 * @param options - The options for the updateTokenIdERC1155 function.
 * @returns The encoded ABI parameters.
 * @modules SequentialTokenIdERC1155
 * @example
 * ```ts
 * import { SequentialTokenIdERC1155 } from "thirdweb/modules";
 * const result = SequentialTokenIdERC1155.encodeUpdateTokenIdERC1155Params({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeUpdateTokenIdERC1155Params(
  options: UpdateTokenIdERC1155Params,
) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "updateTokenIdERC1155" function into a Hex string with its parameters.
 * @param options - The options for the updateTokenIdERC1155 function.
 * @returns The encoded hexadecimal string.
 * @modules SequentialTokenIdERC1155
 * @example
 * ```ts
 * import { SequentialTokenIdERC1155 } from "thirdweb/modules";
 * const result = SequentialTokenIdERC1155.encodeUpdateTokenIdERC1155({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeUpdateTokenIdERC1155(
  options: UpdateTokenIdERC1155Params,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUpdateTokenIdERC1155Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "updateTokenIdERC1155" function on the contract.
 * @param options - The options for the "updateTokenIdERC1155" function.
 * @returns A prepared transaction object.
 * @modules SequentialTokenIdERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { SequentialTokenIdERC1155 } from "thirdweb/modules";
 *
 * const transaction = SequentialTokenIdERC1155.updateTokenIdERC1155({
 *  contract,
 *  tokenId: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function updateTokenIdERC1155(
  options: BaseTransactionOptions<
    | UpdateTokenIdERC1155Params
    | {
        asyncParams: () => Promise<UpdateTokenIdERC1155Params>;
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
      return [resolvedOptions.tokenId] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
