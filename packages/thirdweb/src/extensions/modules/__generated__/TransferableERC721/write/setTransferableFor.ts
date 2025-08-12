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
    name: "target",
    type: "address",
  },
  {
    name: "enableTransfer",
    type: "bool",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setTransferableFor` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setTransferableFor` method is supported.
 * @modules TransferableERC721
 * @example
 * ```ts
 * import { TransferableERC721 } from "thirdweb/modules";
 *
 * const supported = TransferableERC721.isSetTransferableForSupported(["0x..."]);
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
 * @modules TransferableERC721
 * @example
 * ```ts
 * import { TransferableERC721 } from "thirdweb/modules";
 * const result = TransferableERC721.encodeSetTransferableForParams({
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
 * @modules TransferableERC721
 * @example
 * ```ts
 * import { TransferableERC721 } from "thirdweb/modules";
 * const result = TransferableERC721.encodeSetTransferableFor({
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
 * @modules TransferableERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { TransferableERC721 } from "thirdweb/modules";
 *
 * const transaction = TransferableERC721.setTransferableFor({
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
      return [resolvedOptions.target, resolvedOptions.enableTransfer] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
