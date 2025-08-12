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
 * Represents the parameters for the "safeBatchTransferFrom" function.
 */
export type SafeBatchTransferFromParams = WithOverrides<{
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "_from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "_to" }>;
  tokenIds: AbiParameterToPrimitiveType<{
    type: "uint256[]";
    name: "tokenIds";
  }>;
  values: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "_values" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
}>;

export const FN_SELECTOR = "0x2eb2c2d6" as const;
const FN_INPUTS = [
  {
    name: "_from",
    type: "address",
  },
  {
    name: "_to",
    type: "address",
  },
  {
    name: "tokenIds",
    type: "uint256[]",
  },
  {
    name: "_values",
    type: "uint256[]",
  },
  {
    name: "_data",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `safeBatchTransferFrom` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `safeBatchTransferFrom` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isSafeBatchTransferFromSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isSafeBatchTransferFromSupported(["0x..."]);
 * ```
 */
export function isSafeBatchTransferFromSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "safeBatchTransferFrom" function.
 * @param options - The options for the safeBatchTransferFrom function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSafeBatchTransferFromParams } from "thirdweb/extensions/erc1155";
 * const result = encodeSafeBatchTransferFromParams({
 *  from: ...,
 *  to: ...,
 *  tokenIds: ...,
 *  values: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeSafeBatchTransferFromParams(
  options: SafeBatchTransferFromParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.tokenIds,
    options.values,
    options.data,
  ]);
}

/**
 * Encodes the "safeBatchTransferFrom" function into a Hex string with its parameters.
 * @param options - The options for the safeBatchTransferFrom function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSafeBatchTransferFrom } from "thirdweb/extensions/erc1155";
 * const result = encodeSafeBatchTransferFrom({
 *  from: ...,
 *  to: ...,
 *  tokenIds: ...,
 *  values: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeSafeBatchTransferFrom(
  options: SafeBatchTransferFromParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSafeBatchTransferFromParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "safeBatchTransferFrom" function on the contract.
 * @param options - The options for the "safeBatchTransferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { safeBatchTransferFrom } from "thirdweb/extensions/erc1155";
 *
 * const transaction = safeBatchTransferFrom({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  tokenIds: ...,
 *  values: ...,
 *  data: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function safeBatchTransferFrom(
  options: BaseTransactionOptions<
    | SafeBatchTransferFromParams
    | {
        asyncParams: () => Promise<SafeBatchTransferFromParams>;
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
        resolvedOptions.from,
        resolvedOptions.to,
        resolvedOptions.tokenIds,
        resolvedOptions.values,
        resolvedOptions.data,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
