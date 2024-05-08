import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */
export type SafeTransferFromParams = WithOverrides<{
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "_from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "_to" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_value" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
}>;

export const FN_SELECTOR = "0xf242432a" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_from",
  },
  {
    type: "address",
    name: "_to",
  },
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "uint256",
    name: "_value",
  },
  {
    type: "bytes",
    name: "_data",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `safeTransferFrom` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `safeTransferFrom` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isSafeTransferFromSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = await isSafeTransferFromSupported(contract);
 * ```
 */
export async function isSafeTransferFromSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "safeTransferFrom" function.
 * @param options - The options for the safeTransferFrom function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSafeTransferFromParams } "thirdweb/extensions/erc1155";
 * const result = encodeSafeTransferFromParams({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 *  value: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeSafeTransferFromParams(options: SafeTransferFromParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.tokenId,
    options.value,
    options.data,
  ]);
}

/**
 * Encodes the "safeTransferFrom" function into a Hex string with its parameters.
 * @param options - The options for the safeTransferFrom function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSafeTransferFrom } "thirdweb/extensions/erc1155";
 * const result = encodeSafeTransferFrom({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 *  value: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeSafeTransferFrom(options: SafeTransferFromParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSafeTransferFromParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "safeTransferFrom" function on the contract.
 * @param options - The options for the "safeTransferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { safeTransferFrom } from "thirdweb/extensions/erc1155";
 *
 * const transaction = safeTransferFrom({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 *  value: ...,
 *  data: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function safeTransferFrom(
  options: BaseTransactionOptions<
    | SafeTransferFromParams
    | {
        asyncParams: () => Promise<SafeTransferFromParams>;
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
        resolvedOptions.from,
        resolvedOptions.to,
        resolvedOptions.tokenId,
        resolvedOptions.value,
        resolvedOptions.data,
      ] as const;
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
  });
}
