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
 * Represents the parameters for the "setTokenURI" function.
 */
export type SetTokenURIParams = WithOverrides<{
  id: AbiParameterToPrimitiveType<{
    name: "_id";
    type: "uint256";
    internalType: "uint256";
  }>;
  uri: AbiParameterToPrimitiveType<{
    name: "_uri";
    type: "string";
    internalType: "string";
  }>;
}>;

export const FN_SELECTOR = "0x162094c4" as const;
const FN_INPUTS = [
  {
    name: "_id",
    type: "uint256",
    internalType: "uint256",
  },
  {
    name: "_uri",
    type: "string",
    internalType: "string",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setTokenURI` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setTokenURI` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isSetTokenURISupported } from "thirdweb/extensions/modular";
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeSetTokenURIParams } "thirdweb/extensions/modular";
 * const result = encodeSetTokenURIParams({
 *  id: ...,
 *  uri: ...,
 * });
 * ```
 */
export function encodeSetTokenURIParams(options: SetTokenURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.id, options.uri]);
}

/**
 * Encodes the "setTokenURI" function into a Hex string with its parameters.
 * @param options - The options for the setTokenURI function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeSetTokenURI } "thirdweb/extensions/modular";
 * const result = encodeSetTokenURI({
 *  id: ...,
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { setTokenURI } from "thirdweb/extensions/modular";
 *
 * const transaction = setTokenURI({
 *  contract,
 *  id: ...,
 *  uri: ...,
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.id, resolvedOptions.uri] as const;
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
