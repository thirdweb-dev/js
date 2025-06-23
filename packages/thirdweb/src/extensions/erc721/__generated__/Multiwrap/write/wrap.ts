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
 * Represents the parameters for the "wrap" function.
 */
export type WrapParams = WithOverrides<{
  tokensToWrap: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "_tokensToWrap";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint8"; name: "tokenType" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "amount" },
    ];
  }>;
  uriForWrappedToken: AbiParameterToPrimitiveType<{
    type: "string";
    name: "_uriForWrappedToken";
  }>;
  recipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_recipient";
  }>;
}>;

export const FN_SELECTOR = "0x29e471dd" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "assetContract",
        type: "address",
      },
      {
        name: "tokenType",
        type: "uint8",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    name: "_tokensToWrap",
    type: "tuple[]",
  },
  {
    name: "_uriForWrappedToken",
    type: "string",
  },
  {
    name: "_recipient",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "tokenId",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `wrap` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `wrap` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isWrapSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isWrapSupported(["0x..."]);
 * ```
 */
export function isWrapSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "wrap" function.
 * @param options - The options for the wrap function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeWrapParams } from "thirdweb/extensions/erc721";
 * const result = encodeWrapParams({
 *  tokensToWrap: ...,
 *  uriForWrappedToken: ...,
 *  recipient: ...,
 * });
 * ```
 */
export function encodeWrapParams(options: WrapParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokensToWrap,
    options.uriForWrappedToken,
    options.recipient,
  ]);
}

/**
 * Encodes the "wrap" function into a Hex string with its parameters.
 * @param options - The options for the wrap function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeWrap } from "thirdweb/extensions/erc721";
 * const result = encodeWrap({
 *  tokensToWrap: ...,
 *  uriForWrappedToken: ...,
 *  recipient: ...,
 * });
 * ```
 */
export function encodeWrap(options: WrapParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeWrapParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "wrap" function on the contract.
 * @param options - The options for the "wrap" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { wrap } from "thirdweb/extensions/erc721";
 *
 * const transaction = wrap({
 *  contract,
 *  tokensToWrap: ...,
 *  uriForWrappedToken: ...,
 *  recipient: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function wrap(
  options: BaseTransactionOptions<
    | WrapParams
    | {
        asyncParams: () => Promise<WrapParams>;
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
        resolvedOptions.tokensToWrap,
        resolvedOptions.uriForWrappedToken,
        resolvedOptions.recipient,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
