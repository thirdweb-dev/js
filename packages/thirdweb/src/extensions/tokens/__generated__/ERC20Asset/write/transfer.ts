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
 * Represents the parameters for the "transfer" function.
 */
export type TransferParams = WithOverrides<{
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
}>;

export const FN_SELECTOR = "0xa9059cbb" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "to",
  },
  {
    type: "uint256",
    name: "amount",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `transfer` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `transfer` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isTransferSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isTransferSupported(["0x..."]);
 * ```
 */
export function isTransferSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "transfer" function.
 * @param options - The options for the transfer function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeTransferParams } from "thirdweb/extensions/tokens";
 * const result = encodeTransferParams({
 *  to: ...,
 *  amount: ...,
 * });
 * ```
 */
export function encodeTransferParams(options: TransferParams) {
  return encodeAbiParameters(FN_INPUTS, [options.to, options.amount]);
}

/**
 * Encodes the "transfer" function into a Hex string with its parameters.
 * @param options - The options for the transfer function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeTransfer } from "thirdweb/extensions/tokens";
 * const result = encodeTransfer({
 *  to: ...,
 *  amount: ...,
 * });
 * ```
 */
export function encodeTransfer(options: TransferParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTransferParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "transfer" function on the contract.
 * @param options - The options for the "transfer" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { transfer } from "thirdweb/extensions/tokens";
 *
 * const transaction = transfer({
 *  contract,
 *  to: ...,
 *  amount: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function transfer(
  options: BaseTransactionOptions<
    | TransferParams
    | {
        asyncParams: () => Promise<TransferParams>;
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
      return [resolvedOptions.to, resolvedOptions.amount] as const;
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
