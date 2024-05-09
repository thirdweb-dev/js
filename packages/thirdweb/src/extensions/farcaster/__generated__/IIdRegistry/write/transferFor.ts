import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "transferFor" function.
 */
export type TransferForParams = WithOverrides<{
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
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

export const FN_SELECTOR = "0x16f72842" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "from",
  },
  {
    type: "address",
    name: "to",
  },
  {
    type: "uint256",
    name: "fromDeadline",
  },
  {
    type: "bytes",
    name: "fromSig",
  },
  {
    type: "uint256",
    name: "toDeadline",
  },
  {
    type: "bytes",
    name: "toSig",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `transferFor` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `transferFor` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isTransferForSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isTransferForSupported(contract);
 * ```
 */
export async function isTransferForSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "transferFor" function.
 * @param options - The options for the transferFor function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeTransferForParams } "thirdweb/extensions/farcaster";
 * const result = encodeTransferForParams({
 *  from: ...,
 *  to: ...,
 *  fromDeadline: ...,
 *  fromSig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 * ```
 */
export function encodeTransferForParams(options: TransferForParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.fromDeadline,
    options.fromSig,
    options.toDeadline,
    options.toSig,
  ]);
}

/**
 * Encodes the "transferFor" function into a Hex string with its parameters.
 * @param options - The options for the transferFor function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeTransferFor } "thirdweb/extensions/farcaster";
 * const result = encodeTransferFor({
 *  from: ...,
 *  to: ...,
 *  fromDeadline: ...,
 *  fromSig: ...,
 *  toDeadline: ...,
 *  toSig: ...,
 * });
 * ```
 */
export function encodeTransferFor(options: TransferForParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTransferForParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "transferFor" function on the contract.
 * @param options - The options for the "transferFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { transferFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = transferFor({
 *  contract,
 *  from: ...,
 *  to: ...,
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
 * ...
 *
 * ```
 */
export function transferFor(
  options: BaseTransactionOptions<
    | TransferForParams
    | {
        asyncParams: () => Promise<TransferForParams>;
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
      return [
        resolvedOptions.from,
        resolvedOptions.to,
        resolvedOptions.fromDeadline,
        resolvedOptions.fromSig,
        resolvedOptions.toDeadline,
        resolvedOptions.toSig,
      ] as const;
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
  });
}
