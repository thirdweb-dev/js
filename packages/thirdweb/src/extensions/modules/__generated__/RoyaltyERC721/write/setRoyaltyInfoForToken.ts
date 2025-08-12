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
 * Represents the parameters for the "setRoyaltyInfoForToken" function.
 */
export type SetRoyaltyInfoForTokenParams = WithOverrides<{
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
  recipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_recipient";
  }>;
  bps: AbiParameterToPrimitiveType<{ type: "uint16"; name: "_bps" }>;
}>;

export const FN_SELECTOR = "0xab8e8c44" as const;
const FN_INPUTS = [
  {
    name: "_tokenId",
    type: "uint256",
  },
  {
    name: "_recipient",
    type: "address",
  },
  {
    name: "_bps",
    type: "uint16",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setRoyaltyInfoForToken` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setRoyaltyInfoForToken` method is supported.
 * @modules RoyaltyERC721
 * @example
 * ```ts
 * import { RoyaltyERC721 } from "thirdweb/modules";
 *
 * const supported = RoyaltyERC721.isSetRoyaltyInfoForTokenSupported(["0x..."]);
 * ```
 */
export function isSetRoyaltyInfoForTokenSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setRoyaltyInfoForToken" function.
 * @param options - The options for the setRoyaltyInfoForToken function.
 * @returns The encoded ABI parameters.
 * @modules RoyaltyERC721
 * @example
 * ```ts
 * import { RoyaltyERC721 } from "thirdweb/modules";
 * const result = RoyaltyERC721.encodeSetRoyaltyInfoForTokenParams({
 *  tokenId: ...,
 *  recipient: ...,
 *  bps: ...,
 * });
 * ```
 */
export function encodeSetRoyaltyInfoForTokenParams(
  options: SetRoyaltyInfoForTokenParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.tokenId,
    options.recipient,
    options.bps,
  ]);
}

/**
 * Encodes the "setRoyaltyInfoForToken" function into a Hex string with its parameters.
 * @param options - The options for the setRoyaltyInfoForToken function.
 * @returns The encoded hexadecimal string.
 * @modules RoyaltyERC721
 * @example
 * ```ts
 * import { RoyaltyERC721 } from "thirdweb/modules";
 * const result = RoyaltyERC721.encodeSetRoyaltyInfoForToken({
 *  tokenId: ...,
 *  recipient: ...,
 *  bps: ...,
 * });
 * ```
 */
export function encodeSetRoyaltyInfoForToken(
  options: SetRoyaltyInfoForTokenParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetRoyaltyInfoForTokenParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setRoyaltyInfoForToken" function on the contract.
 * @param options - The options for the "setRoyaltyInfoForToken" function.
 * @returns A prepared transaction object.
 * @modules RoyaltyERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { RoyaltyERC721 } from "thirdweb/modules";
 *
 * const transaction = RoyaltyERC721.setRoyaltyInfoForToken({
 *  contract,
 *  tokenId: ...,
 *  recipient: ...,
 *  bps: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setRoyaltyInfoForToken(
  options: BaseTransactionOptions<
    | SetRoyaltyInfoForTokenParams
    | {
        asyncParams: () => Promise<SetRoyaltyInfoForTokenParams>;
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
        resolvedOptions.tokenId,
        resolvedOptions.recipient,
        resolvedOptions.bps,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
