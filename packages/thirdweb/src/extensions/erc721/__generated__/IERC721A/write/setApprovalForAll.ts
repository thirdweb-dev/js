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
 * Represents the parameters for the "setApprovalForAll" function.
 */
export type SetApprovalForAllParams = WithOverrides<{
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "operator" }>;
  approved: AbiParameterToPrimitiveType<{ type: "bool"; name: "_approved" }>;
}>;

export const FN_SELECTOR = "0xa22cb465" as const;
const FN_INPUTS = [
  {
    name: "operator",
    type: "address",
  },
  {
    name: "_approved",
    type: "bool",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setApprovalForAll` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `setApprovalForAll` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isSetApprovalForAllSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isSetApprovalForAllSupported(["0x..."]);
 * ```
 */
export function isSetApprovalForAllSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setApprovalForAll" function.
 * @param options - The options for the setApprovalForAll function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetApprovalForAllParams } from "thirdweb/extensions/erc721";
 * const result = encodeSetApprovalForAllParams({
 *  operator: ...,
 *  approved: ...,
 * });
 * ```
 */
export function encodeSetApprovalForAllParams(
  options: SetApprovalForAllParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.operator, options.approved]);
}

/**
 * Encodes the "setApprovalForAll" function into a Hex string with its parameters.
 * @param options - The options for the setApprovalForAll function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetApprovalForAll } from "thirdweb/extensions/erc721";
 * const result = encodeSetApprovalForAll({
 *  operator: ...,
 *  approved: ...,
 * });
 * ```
 */
export function encodeSetApprovalForAll(options: SetApprovalForAllParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSetApprovalForAllParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "setApprovalForAll" function on the contract.
 * @param options - The options for the "setApprovalForAll" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { setApprovalForAll } from "thirdweb/extensions/erc721";
 *
 * const transaction = setApprovalForAll({
 *  contract,
 *  operator: ...,
 *  approved: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setApprovalForAll(
  options: BaseTransactionOptions<
    | SetApprovalForAllParams
    | {
        asyncParams: () => Promise<SetApprovalForAllParams>;
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
      return [resolvedOptions.operator, resolvedOptions.approved] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
