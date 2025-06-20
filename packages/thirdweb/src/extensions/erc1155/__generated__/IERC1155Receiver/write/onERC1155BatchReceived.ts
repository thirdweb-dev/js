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
 * Represents the parameters for the "onERC1155BatchReceived" function.
 */
export type OnERC1155BatchReceivedParams = WithOverrides<{
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "operator" }>;
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  ids: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "ids" }>;
  values: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "values" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
}>;

export const FN_SELECTOR = "0xbc197c81" as const;
const FN_INPUTS = [
  {
    name: "operator",
    type: "address",
  },
  {
    name: "from",
    type: "address",
  },
  {
    name: "ids",
    type: "uint256[]",
  },
  {
    name: "values",
    type: "uint256[]",
  },
  {
    name: "data",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes4",
  },
] as const;

/**
 * Checks if the `onERC1155BatchReceived` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `onERC1155BatchReceived` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isOnERC1155BatchReceivedSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isOnERC1155BatchReceivedSupported(["0x..."]);
 * ```
 */
export function isOnERC1155BatchReceivedSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "onERC1155BatchReceived" function.
 * @param options - The options for the onERC1155BatchReceived function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeOnERC1155BatchReceivedParams } from "thirdweb/extensions/erc1155";
 * const result = encodeOnERC1155BatchReceivedParams({
 *  operator: ...,
 *  from: ...,
 *  ids: ...,
 *  values: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnERC1155BatchReceivedParams(
  options: OnERC1155BatchReceivedParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.operator,
    options.from,
    options.ids,
    options.values,
    options.data,
  ]);
}

/**
 * Encodes the "onERC1155BatchReceived" function into a Hex string with its parameters.
 * @param options - The options for the onERC1155BatchReceived function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeOnERC1155BatchReceived } from "thirdweb/extensions/erc1155";
 * const result = encodeOnERC1155BatchReceived({
 *  operator: ...,
 *  from: ...,
 *  ids: ...,
 *  values: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnERC1155BatchReceived(
  options: OnERC1155BatchReceivedParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeOnERC1155BatchReceivedParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "onERC1155BatchReceived" function on the contract.
 * @param options - The options for the "onERC1155BatchReceived" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { onERC1155BatchReceived } from "thirdweb/extensions/erc1155";
 *
 * const transaction = onERC1155BatchReceived({
 *  contract,
 *  operator: ...,
 *  from: ...,
 *  ids: ...,
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
export function onERC1155BatchReceived(
  options: BaseTransactionOptions<
    | OnERC1155BatchReceivedParams
    | {
        asyncParams: () => Promise<OnERC1155BatchReceivedParams>;
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
        resolvedOptions.operator,
        resolvedOptions.from,
        resolvedOptions.ids,
        resolvedOptions.values,
        resolvedOptions.data,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
