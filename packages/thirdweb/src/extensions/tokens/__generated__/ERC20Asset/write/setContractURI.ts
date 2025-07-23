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
 * Represents the parameters for the "setContractURI" function.
 */
export type SetContractURIParams = WithOverrides<{
  contractURI: AbiParameterToPrimitiveType<{
    type: "string";
    name: "_contractURI";
  }>;
}>;

export const FN_SELECTOR = "0x938e3d7b" as const;
const FN_INPUTS = [
  {
    type: "string",
    name: "_contractURI",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setContractURI` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setContractURI` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isSetContractURISupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isSetContractURISupported(["0x..."]);
 * ```
 */
export function isSetContractURISupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setContractURI" function.
 * @param options - The options for the setContractURI function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeSetContractURIParams } from "thirdweb/extensions/tokens";
 * const result = encodeSetContractURIParams({
 *  contractURI: ...,
 * });
 * ```
 */
export function encodeSetContractURIParams(options: SetContractURIParams) {
  return encodeAbiParameters(FN_INPUTS, [options.contractURI]);
}

/**
 * Encodes the "setContractURI" function into a Hex string with its parameters.
 * @param options - The options for the setContractURI function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeSetContractURI } from "thirdweb/extensions/tokens";
 * const result = encodeSetContractURI({
 *  contractURI: ...,
 * });
 * ```
 */
export function encodeSetContractURI(options: SetContractURIParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetContractURIParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setContractURI" function on the contract.
 * @param options - The options for the "setContractURI" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setContractURI } from "thirdweb/extensions/tokens";
 *
 * const transaction = setContractURI({
 *  contract,
 *  contractURI: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setContractURI(
  options: BaseTransactionOptions<
    | SetContractURIParams
    | {
        asyncParams: () => Promise<SetContractURIParams>;
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
      return [resolvedOptions.contractURI] as const;
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
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
  });
}
