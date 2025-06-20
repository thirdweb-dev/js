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
 * Represents the parameters for the "changeRecoveryAddressFor" function.
 */
export type ChangeRecoveryAddressForParams = WithOverrides<{
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
}>;

export const FN_SELECTOR = "0x9cbef8dc" as const;
const FN_INPUTS = [
  {
    name: "owner",
    type: "address",
  },
  {
    name: "recovery",
    type: "address",
  },
  {
    name: "deadline",
    type: "uint256",
  },
  {
    name: "sig",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `changeRecoveryAddressFor` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `changeRecoveryAddressFor` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isChangeRecoveryAddressForSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = isChangeRecoveryAddressForSupported(["0x..."]);
 * ```
 */
export function isChangeRecoveryAddressForSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "changeRecoveryAddressFor" function.
 * @param options - The options for the changeRecoveryAddressFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeChangeRecoveryAddressForParams } from "thirdweb/extensions/farcaster";
 * const result = encodeChangeRecoveryAddressForParams({
 *  owner: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeChangeRecoveryAddressForParams(
  options: ChangeRecoveryAddressForParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.owner,
    options.recovery,
    options.deadline,
    options.sig,
  ]);
}

/**
 * Encodes the "changeRecoveryAddressFor" function into a Hex string with its parameters.
 * @param options - The options for the changeRecoveryAddressFor function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeChangeRecoveryAddressFor } from "thirdweb/extensions/farcaster";
 * const result = encodeChangeRecoveryAddressFor({
 *  owner: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 * ```
 */
export function encodeChangeRecoveryAddressFor(
  options: ChangeRecoveryAddressForParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeChangeRecoveryAddressForParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "changeRecoveryAddressFor" function on the contract.
 * @param options - The options for the "changeRecoveryAddressFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { changeRecoveryAddressFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = changeRecoveryAddressFor({
 *  contract,
 *  owner: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function changeRecoveryAddressFor(
  options: BaseTransactionOptions<
    | ChangeRecoveryAddressForParams
    | {
        asyncParams: () => Promise<ChangeRecoveryAddressForParams>;
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
        resolvedOptions.owner,
        resolvedOptions.recovery,
        resolvedOptions.deadline,
        resolvedOptions.sig,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
