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
 * Represents the parameters for the "beforeMintERC721" function.
 */
export type BeforeMintERC721Params = WithOverrides<{
  to: AbiParameterToPrimitiveType<{
    name: "_to";
    type: "address";
    internalType: "address";
  }>;
  startTokenId: AbiParameterToPrimitiveType<{
    name: "_startTokenId";
    type: "uint256";
    internalType: "uint256";
  }>;
  quantity: AbiParameterToPrimitiveType<{
    name: "_quantity";
    type: "uint256";
    internalType: "uint256";
  }>;
  data: AbiParameterToPrimitiveType<{
    name: "_data";
    type: "bytes";
    internalType: "bytes";
  }>;
}>;

export const FN_SELECTOR = "0x765e8093" as const;
const FN_INPUTS = [
  {
    name: "_to",
    type: "address",
    internalType: "address",
  },
  {
    name: "_startTokenId",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "_quantity",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "_data",
    type: "bytes",
    internalType: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "bytes",
    internalType: "bytes",
  },
] as const;

/**
 * Checks if the `beforeMintERC721` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `beforeMintERC721` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isBeforeMintERC721Supported } from "thirdweb/extensions/modular";
 *
 * const supported = isBeforeMintERC721Supported(["0x..."]);
 * ```
 */
export function isBeforeMintERC721Supported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "beforeMintERC721" function.
 * @param options - The options for the beforeMintERC721 function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBeforeMintERC721Params } "thirdweb/extensions/modular";
 * const result = encodeBeforeMintERC721Params({
 *  to: ...,
 *  startTokenId: ...,
 *  quantity: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeBeforeMintERC721Params(options: BeforeMintERC721Params) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.startTokenId,
    options.quantity,
    options.data,
  ]);
}

/**
 * Encodes the "beforeMintERC721" function into a Hex string with its parameters.
 * @param options - The options for the beforeMintERC721 function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeBeforeMintERC721 } "thirdweb/extensions/modular";
 * const result = encodeBeforeMintERC721({
 *  to: ...,
 *  startTokenId: ...,
 *  quantity: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeBeforeMintERC721(options: BeforeMintERC721Params) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBeforeMintERC721Params(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "beforeMintERC721" function on the contract.
 * @param options - The options for the "beforeMintERC721" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { beforeMintERC721 } from "thirdweb/extensions/modular";
 *
 * const transaction = beforeMintERC721({
 *  contract,
 *  to: ...,
 *  startTokenId: ...,
 *  quantity: ...,
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
export function beforeMintERC721(
  options: BaseTransactionOptions<
    | BeforeMintERC721Params
    | {
        asyncParams: () => Promise<BeforeMintERC721Params>;
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
        resolvedOptions.to,
        resolvedOptions.startTokenId,
        resolvedOptions.quantity,
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
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
  });
}
