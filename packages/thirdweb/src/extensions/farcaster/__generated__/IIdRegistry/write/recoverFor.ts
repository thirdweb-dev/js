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
 * Represents the parameters for the "recoverFor" function.
 */
export type RecoverForParams = WithOverrides<{
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  recoveryDeadline: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "recoveryDeadline";
  }>;
  recoverySig: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "recoverySig";
  }>;
  toDeadline: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "toDeadline";
  }>;
  toSig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "toSig" }>;
}>;

export const FN_SELECTOR = "0xba656434" as const;
const FN_INPUTS = [
  {
    name: "from",
    type: "address",
  },
  {
    name: "to",
    type: "address",
  },
  {
    name: "recoveryDeadline",
    type: "uint256",
  },
  {
    name: "recoverySig",
    type: "bytes",
  },
  {
    name: "toDeadline",
    type: "uint256",
  },
  {
    name: "toSig",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `recoverFor` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `recoverFor` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isRecoverForSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = isRecoverForSupported(["0x..."]);
 * ```
 */
export function isRecoverForSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "recoverFor" function.
 * @param options - The options for the recoverFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRecoverForParams } from "thirdweb/extensions/farcaster";
 * const result = encodeRecoverForParams({
 *  from: ...,
 *  to: ...,
 *  recoveryDeadline: ...,
 *  recoverySig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 * ```
 */
export function encodeRecoverForParams(options: RecoverForParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.recoveryDeadline,
    options.recoverySig,
    options.toDeadline,
    options.toSig,
  ]);
}

/**
 * Encodes the "recoverFor" function into a Hex string with its parameters.
 * @param options - The options for the recoverFor function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeRecoverFor } from "thirdweb/extensions/farcaster";
 * const result = encodeRecoverFor({
 *  from: ...,
 *  to: ...,
 *  recoveryDeadline: ...,
 *  recoverySig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 * ```
 */
export function encodeRecoverFor(options: RecoverForParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRecoverForParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "recoverFor" function on the contract.
 * @param options - The options for the "recoverFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { recoverFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = recoverFor({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  recoveryDeadline: ...,
 *  recoverySig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function recoverFor(
  options: BaseTransactionOptions<
    | RecoverForParams
    | {
        asyncParams: () => Promise<RecoverForParams>;
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
        resolvedOptions.from,
        resolvedOptions.to,
        resolvedOptions.recoveryDeadline,
        resolvedOptions.recoverySig,
        resolvedOptions.toDeadline,
        resolvedOptions.toSig,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
