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
 * Represents the parameters for the "setAppURI" function.
 */
export type SetAppURIParams = WithOverrides<{
  uri: AbiParameterToPrimitiveType<{ type: "string"; name: "_uri" }>;
}>;

export const FN_SELECTOR = "0xfea18082" as const;
const FN_INPUTS = [
  {
    name: "_uri",
    type: "string",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setAppURI` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setAppURI` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isSetAppURISupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = isSetAppURISupported(["0x..."]);
 * ```
 */
export function isSetAppURISupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setAppURI" function.
 * @param options - The options for the setAppURI function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeSetAppURIParams } from "thirdweb/extensions/thirdweb";
 * const result = encodeSetAppURIParams({
 *  uri: ...,
 * });
 * ```
 */
export function encodeSetAppURIParams(options: SetAppURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.uri]);
}

/**
 * Encodes the "setAppURI" function into a Hex string with its parameters.
 * @param options - The options for the setAppURI function.
 * @returns The encoded hexadecimal string.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeSetAppURI } from "thirdweb/extensions/thirdweb";
 * const result = encodeSetAppURI({
 *  uri: ...,
 * });
 * ```
 */
export function encodeSetAppURI(options: SetAppURIParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetAppURIParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setAppURI" function on the contract.
 * @param options - The options for the "setAppURI" function.
 * @returns A prepared transaction object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setAppURI } from "thirdweb/extensions/thirdweb";
 *
 * const transaction = setAppURI({
 *  contract,
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
export function setAppURI(
  options: BaseTransactionOptions<
    | SetAppURIParams
    | {
        asyncParams: () => Promise<SetAppURIParams>;
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
      return [resolvedOptions.uri] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
