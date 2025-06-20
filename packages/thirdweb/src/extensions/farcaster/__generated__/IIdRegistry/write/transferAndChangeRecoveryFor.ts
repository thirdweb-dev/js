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
 * Represents the parameters for the "transferAndChangeRecoveryFor" function.
 */
export type TransferAndChangeRecoveryForParams = WithOverrides<{
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
  fromDeadline: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "fromDeadline";
  }>;
  fromSig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "fromSig" }>;
  toDeadline: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "toDeadline";
  }>;
  toSig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "toSig" }>;
}>;

export const FN_SELECTOR = "0x4c5cbb34" as const;
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
    name: "recovery",
    type: "address",
  },
  {
    name: "fromDeadline",
    type: "uint256",
  },
  {
    name: "fromSig",
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
 * Checks if the `transferAndChangeRecoveryFor` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `transferAndChangeRecoveryFor` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isTransferAndChangeRecoveryForSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = isTransferAndChangeRecoveryForSupported(["0x..."]);
 * ```
 */
export function isTransferAndChangeRecoveryForSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "transferAndChangeRecoveryFor" function.
 * @param options - The options for the transferAndChangeRecoveryFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeTransferAndChangeRecoveryForParams } from "thirdweb/extensions/farcaster";
 * const result = encodeTransferAndChangeRecoveryForParams({
 *  from: ...,
 *  to: ...,
 *  recovery: ...,
 *  fromDeadline: ...,
 *  fromSig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 * ```
 */
export function encodeTransferAndChangeRecoveryForParams(
  options: TransferAndChangeRecoveryForParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.recovery,
    options.fromDeadline,
    options.fromSig,
    options.toDeadline,
    options.toSig,
  ]);
}

/**
 * Encodes the "transferAndChangeRecoveryFor" function into a Hex string with its parameters.
 * @param options - The options for the transferAndChangeRecoveryFor function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeTransferAndChangeRecoveryFor } from "thirdweb/extensions/farcaster";
 * const result = encodeTransferAndChangeRecoveryFor({
 *  from: ...,
 *  to: ...,
 *  recovery: ...,
 *  fromDeadline: ...,
 *  fromSig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 * ```
 */
export function encodeTransferAndChangeRecoveryFor(
  options: TransferAndChangeRecoveryForParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTransferAndChangeRecoveryForParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "transferAndChangeRecoveryFor" function on the contract.
 * @param options - The options for the "transferAndChangeRecoveryFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { transferAndChangeRecoveryFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = transferAndChangeRecoveryFor({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  recovery: ...,
 *  fromDeadline: ...,
 *  fromSig: ...,
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
export function transferAndChangeRecoveryFor(
  options: BaseTransactionOptions<
    | TransferAndChangeRecoveryForParams
    | {
        asyncParams: () => Promise<TransferAndChangeRecoveryForParams>;
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
        resolvedOptions.recovery,
        resolvedOptions.fromDeadline,
        resolvedOptions.fromSig,
        resolvedOptions.toDeadline,
        resolvedOptions.toSig,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
