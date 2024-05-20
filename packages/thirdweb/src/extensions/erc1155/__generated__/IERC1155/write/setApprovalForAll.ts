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
 * Represents the parameters for the "setApprovalForAll" function.
 */
export type SetApprovalForAllParams = WithOverrides<{
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "_operator" }>;
  approved: AbiParameterToPrimitiveType<{ type: "bool"; name: "_approved" }>;
}>;

export const FN_SELECTOR = "0xa22cb465" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_operator",
  },
  {
    type: "bool",
    name: "_approved",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `setApprovalForAll` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `setApprovalForAll` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isSetApprovalForAllSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = await isSetApprovalForAllSupported(contract);
 * ```
 */
export async function isSetApprovalForAllSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "setApprovalForAll" function.
 * @param options - The options for the setApprovalForAll function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSetApprovalForAllParams } "thirdweb/extensions/erc1155";
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
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeSetApprovalForAll } "thirdweb/extensions/erc1155";
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
 * @extension ERC1155
 * @example
 * ```ts
 * import { setApprovalForAll } from "thirdweb/extensions/erc1155";
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
 * ...
 *
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.operator, resolvedOptions.approved] as const;
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
