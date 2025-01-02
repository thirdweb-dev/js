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
 * Represents the parameters for the "setTransferable" function.
 */
export type SetTransferableParams = WithOverrides<{
  enableTransfer: AbiParameterToPrimitiveType<{
    type: "bool";
    name: "enableTransfer";
  }>;
}>;

export const FN_SELECTOR = "0x9cd23707" as const;
const FN_INPUTS = [
  {
    type: "bool",
    name: "enableTransfer",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setTransferable` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setTransferable` method is supported.
 * @modules TransferableERC1155
 * @example
 * ```ts
 * import { TransferableERC1155 } from "thirdweb/modules";
 *
 * const supported = TransferableERC1155.isSetTransferableSupported(["0x..."]);
 * ```
 */
export function isSetTransferableSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setTransferable" function.
 * @param options - The options for the setTransferable function.
 * @returns The encoded ABI parameters.
 * @modules TransferableERC1155
 * @example
 * ```ts
 * import { TransferableERC1155 } from "thirdweb/modules";
 * const result = TransferableERC1155.encodeSetTransferableParams({
 *  enableTransfer: ...,
 * });
 * ```
 */
export function encodeSetTransferableParams(options: SetTransferableParams) {
  return encodeAbiParameters(FN_INPUTS, [options.enableTransfer]);
}

/**
 * Encodes the "setTransferable" function into a Hex string with its parameters.
 * @param options - The options for the setTransferable function.
 * @returns The encoded hexadecimal string.
 * @modules TransferableERC1155
 * @example
 * ```ts
 * import { TransferableERC1155 } from "thirdweb/modules";
 * const result = TransferableERC1155.encodeSetTransferable({
 *  enableTransfer: ...,
 * });
 * ```
 */
export function encodeSetTransferable(options: SetTransferableParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetTransferableParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setTransferable" function on the contract.
 * @param options - The options for the "setTransferable" function.
 * @returns A prepared transaction object.
 * @modules TransferableERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { TransferableERC1155 } from "thirdweb/modules";
 *
 * const transaction = TransferableERC1155.setTransferable({
 *  contract,
 *  enableTransfer: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setTransferable(
  options: BaseTransactionOptions<
    | SetTransferableParams
    | {
        asyncParams: () => Promise<SetTransferableParams>;
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
      return [resolvedOptions.enableTransfer] as const;
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
