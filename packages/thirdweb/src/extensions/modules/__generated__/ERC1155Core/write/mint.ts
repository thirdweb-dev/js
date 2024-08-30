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
 * Represents the parameters for the "mint" function.
 */
export type MintParams = WithOverrides<{
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
}>;

export const FN_SELECTOR = "0x731133e9" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "to",
  },
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "uint256",
    name: "value",
  },
  {
    type: "bytes",
    name: "data",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `mint` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `mint` method is supported.
 * @module ERC1155Core
 * @example
 * ```ts
 * import { ERC1155Core } from "thirdweb/modules";
 *
 * const supported = ERC1155Core.isMintSupported(["0x..."]);
 * ```
 */
export function isMintSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "mint" function.
 * @param options - The options for the mint function.
 * @returns The encoded ABI parameters.
 * @module ERC1155Core
 * @example
 * ```ts
 * import { ERC1155Core } from "thirdweb/modules";
 * const result = ERC1155Core.encodeMintParams({
 *  to: ...,
 *  tokenId: ...,
 *  value: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeMintParams(options: MintParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.to,
    options.tokenId,
    options.value,
    options.data,
  ]);
}

/**
 * Encodes the "mint" function into a Hex string with its parameters.
 * @param options - The options for the mint function.
 * @returns The encoded hexadecimal string.
 * @module ERC1155Core
 * @example
 * ```ts
 * import { ERC1155Core } from "thirdweb/modules";
 * const result = ERC1155Core.encodeMint({
 *  to: ...,
 *  tokenId: ...,
 *  value: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeMint(options: MintParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeMintParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "mint" function on the contract.
 * @param options - The options for the "mint" function.
 * @returns A prepared transaction object.
 * @module ERC1155Core
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { ERC1155Core } from "thirdweb/modules";
 *
 * const transaction = ERC1155Core.mint({
 *  contract,
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
 * await sendTransaction({ transaction, account });
 * ```
 */
export function mint(
  options: BaseTransactionOptions<
    | MintParams
    | {
        asyncParams: () => Promise<MintParams>;
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
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
  });
}
