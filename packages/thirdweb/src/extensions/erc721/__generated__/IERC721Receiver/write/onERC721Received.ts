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
 * Represents the parameters for the "onERC721Received" function.
 */
export type OnERC721ReceivedParams = WithOverrides<{
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "operator" }>;
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
}>;

export const FN_SELECTOR = "0x150b7a02" as const;
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
    name: "tokenId",
    type: "uint256",
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
 * Checks if the `onERC721Received` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `onERC721Received` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isOnERC721ReceivedSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isOnERC721ReceivedSupported(["0x..."]);
 * ```
 */
export function isOnERC721ReceivedSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "onERC721Received" function.
 * @param options - The options for the onERC721Received function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeOnERC721ReceivedParams } from "thirdweb/extensions/erc721";
 * const result = encodeOnERC721ReceivedParams({
 *  operator: ...,
 *  from: ...,
 *  tokenId: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnERC721ReceivedParams(options: OnERC721ReceivedParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.operator,
    options.from,
    options.tokenId,
    options.data,
  ]);
}

/**
 * Encodes the "onERC721Received" function into a Hex string with its parameters.
 * @param options - The options for the onERC721Received function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeOnERC721Received } from "thirdweb/extensions/erc721";
 * const result = encodeOnERC721Received({
 *  operator: ...,
 *  from: ...,
 *  tokenId: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnERC721Received(options: OnERC721ReceivedParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeOnERC721ReceivedParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "onERC721Received" function on the contract.
 * @param options - The options for the "onERC721Received" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { onERC721Received } from "thirdweb/extensions/erc721";
 *
 * const transaction = onERC721Received({
 *  contract,
 *  operator: ...,
 *  from: ...,
 *  tokenId: ...,
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
export function onERC721Received(
  options: BaseTransactionOptions<
    | OnERC721ReceivedParams
    | {
        asyncParams: () => Promise<OnERC721ReceivedParams>;
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
        resolvedOptions.tokenId,
        resolvedOptions.data,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
