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
 * Represents the parameters for the "setTokenURI" function.
 */
export type SetTokenURIParams = WithOverrides<{
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "_uri" }>;
}>;

export const FN_SELECTOR = "0x162094c4" as const;
const FN_INPUTS = [
  {
    name: "_tokenId",
    type: "uint256",
  },
  {
    name: "_uri",
    type: "string",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setTokenURI` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setTokenURI` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isSetTokenURISupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isSetTokenURISupported(["0x..."]);
 * ```
 */
export function isSetTokenURISupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setTokenURI" function.
 * @param options - The options for the setTokenURI function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetTokenURIParams } from "thirdweb/extensions/erc721";
 * const result = encodeSetTokenURIParams({
 *  tokenId: ...,
 *  uri: ...,
 * });
 * ```
 */
export function encodeSetTokenURIParams(options: SetTokenURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId, options.uri]);
}

/**
 * Encodes the "setTokenURI" function into a Hex string with its parameters.
 * @param options - The options for the setTokenURI function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetTokenURI } from "thirdweb/extensions/erc721";
 * const result = encodeSetTokenURI({
 *  tokenId: ...,
 *  uri: ...,
 * });
 * ```
 */
export function encodeSetTokenURI(options: SetTokenURIParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetTokenURIParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setTokenURI" function on the contract.
 * @param options - The options for the "setTokenURI" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setTokenURI } from "thirdweb/extensions/erc721";
 *
 * const transaction = setTokenURI({
 *  contract,
 *  tokenId: ...,
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
export function setTokenURI(
  options: BaseTransactionOptions<
    | SetTokenURIParams
    | {
        asyncParams: () => Promise<SetTokenURIParams>;
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
      return [resolvedOptions.tokenId, resolvedOptions.uri] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
