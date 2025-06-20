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
 * Represents the parameters for the "batchRent" function.
 */
export type BatchRentParams = WithOverrides<{
  fids: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "fids" }>;
  units: AbiParameterToPrimitiveType<{ type: "uint256[]"; name: "units" }>;
}>;

export const FN_SELECTOR = "0xa82c356e" as const;
const FN_INPUTS = [
  {
    name: "fids",
    type: "uint256[]",
  },
  {
    name: "units",
    type: "uint256[]",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `batchRent` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `batchRent` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isBatchRentSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = isBatchRentSupported(["0x..."]);
 * ```
 */
export function isBatchRentSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "batchRent" function.
 * @param options - The options for the batchRent function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeBatchRentParams } from "thirdweb/extensions/farcaster";
 * const result = encodeBatchRentParams({
 *  fids: ...,
 *  units: ...,
 * });
 * ```
 */
export function encodeBatchRentParams(options: BatchRentParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fids, options.units]);
}

/**
 * Encodes the "batchRent" function into a Hex string with its parameters.
 * @param options - The options for the batchRent function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeBatchRent } from "thirdweb/extensions/farcaster";
 * const result = encodeBatchRent({
 *  fids: ...,
 *  units: ...,
 * });
 * ```
 */
export function encodeBatchRent(options: BatchRentParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBatchRentParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "batchRent" function on the contract.
 * @param options - The options for the "batchRent" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { batchRent } from "thirdweb/extensions/farcaster";
 *
 * const transaction = batchRent({
 *  contract,
 *  fids: ...,
 *  units: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function batchRent(
  options: BaseTransactionOptions<
    | BatchRentParams
    | {
        asyncParams: () => Promise<BatchRentParams>;
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
      return [resolvedOptions.fids, resolvedOptions.units] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
