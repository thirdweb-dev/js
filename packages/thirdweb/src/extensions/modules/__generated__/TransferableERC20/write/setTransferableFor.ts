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
 * Represents the parameters for the "setTransferableFor" function.
 */
export type SetTransferableForParams = WithOverrides<{
  target: AbiParameterToPrimitiveType<{ type: "address"; name: "target" }>;
  enableTransfer: AbiParameterToPrimitiveType<{
    type: "bool";
    name: "enableTransfer";
  }>;
}>;

export const FN_SELECTOR = "0x4c297cbd" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "target",
  },
  {
    type: "bool",
    name: "enableTransfer",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setTransferableFor` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setTransferableFor` method is supported.
 * @module TransferableERC20
 * @example
 * ```ts
 * import { TransferableERC20 } from "thirdweb/modules";
 *
 * const supported = TransferableERC20.isSetTransferableForSupported(["0x..."]);
 * ```
 */
export function isSetTransferableForSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setTransferableFor" function.
 * @param options - The options for the setTransferableFor function.
 * @returns The encoded ABI parameters.
 * @module TransferableERC20
 * @example
 * ```ts
 * import { TransferableERC20 } from "thirdweb/modules";
 * const result = TransferableERC20.encodeSetTransferableForParams({
 *  target: ...,
 *  enableTransfer: ...,
 * });
 * ```
 */
export function encodeSetTransferableForParams(
  options: SetTransferableForParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.target,
    options.enableTransfer,
  ]);
}

/**
 * Encodes the "setTransferableFor" function into a Hex string with its parameters.
 * @param options - The options for the setTransferableFor function.
 * @returns The encoded hexadecimal string.
 * @module TransferableERC20
 * @example
 * ```ts
 * import { TransferableERC20 } from "thirdweb/modules";
 * const result = TransferableERC20.encodeSetTransferableFor({
 *  target: ...,
 *  enableTransfer: ...,
 * });
 * ```
 */
export function encodeSetTransferableFor(options: SetTransferableForParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetTransferableForParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setTransferableFor" function on the contract.
 * @param options - The options for the "setTransferableFor" function.
 * @returns A prepared transaction object.
 * @module TransferableERC20
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { TransferableERC20 } from "thirdweb/modules";
 *
 * const transaction = TransferableERC20.setTransferableFor({
 *  contract,
 *  target: ...,
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
export function setTransferableFor(
  options: BaseTransactionOptions<
    | SetTransferableForParams
    | {
        asyncParams: () => Promise<SetTransferableForParams>;
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
      return [resolvedOptions.target, resolvedOptions.enableTransfer] as const;
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
