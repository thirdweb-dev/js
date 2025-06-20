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
    name: "enableTransfer",
    type: "bool",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setTransferable` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setTransferable` method is supported.
 * @modules TransferableERC721
 * @example
 * ```ts
 * import { TransferableERC721 } from "thirdweb/modules";
 *
 * const supported = TransferableERC721.isSetTransferableSupported(["0x..."]);
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
 * @modules TransferableERC721
 * @example
 * ```ts
 * import { TransferableERC721 } from "thirdweb/modules";
 * const result = TransferableERC721.encodeSetTransferableParams({
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
 * @modules TransferableERC721
 * @example
 * ```ts
 * import { TransferableERC721 } from "thirdweb/modules";
 * const result = TransferableERC721.encodeSetTransferable({
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
 * @modules TransferableERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { TransferableERC721 } from "thirdweb/modules";
 *
 * const transaction = TransferableERC721.setTransferable({
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
      return [resolvedOptions.enableTransfer] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
