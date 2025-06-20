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
 * Represents the parameters for the "onSignerAdded" function.
 */
export type OnSignerAddedParams = WithOverrides<{
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
  creatorAdmin: AbiParameterToPrimitiveType<{
    type: "address";
    name: "creatorAdmin";
  }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "data" }>;
}>;

export const FN_SELECTOR = "0x9ddbb9d8" as const;
const FN_INPUTS = [
  {
    name: "signer",
    type: "address",
  },
  {
    name: "creatorAdmin",
    type: "address",
  },
  {
    name: "data",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `onSignerAdded` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `onSignerAdded` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isOnSignerAddedSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isOnSignerAddedSupported(["0x..."]);
 * ```
 */
export function isOnSignerAddedSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "onSignerAdded" function.
 * @param options - The options for the onSignerAdded function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeOnSignerAddedParams } from "thirdweb/extensions/erc4337";
 * const result = encodeOnSignerAddedParams({
 *  signer: ...,
 *  creatorAdmin: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnSignerAddedParams(options: OnSignerAddedParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.signer,
    options.creatorAdmin,
    options.data,
  ]);
}

/**
 * Encodes the "onSignerAdded" function into a Hex string with its parameters.
 * @param options - The options for the onSignerAdded function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeOnSignerAdded } from "thirdweb/extensions/erc4337";
 * const result = encodeOnSignerAdded({
 *  signer: ...,
 *  creatorAdmin: ...,
 *  data: ...,
 * });
 * ```
 */
export function encodeOnSignerAdded(options: OnSignerAddedParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeOnSignerAddedParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "onSignerAdded" function on the contract.
 * @param options - The options for the "onSignerAdded" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { onSignerAdded } from "thirdweb/extensions/erc4337";
 *
 * const transaction = onSignerAdded({
 *  contract,
 *  signer: ...,
 *  creatorAdmin: ...,
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
export function onSignerAdded(
  options: BaseTransactionOptions<
    | OnSignerAddedParams
    | {
        asyncParams: () => Promise<OnSignerAddedParams>;
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
        resolvedOptions.signer,
        resolvedOptions.creatorAdmin,
        resolvedOptions.data,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
