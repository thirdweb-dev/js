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
 * Represents the parameters for the "approve" function.
 */
export type ApproveParams = WithOverrides<{
  spender: AbiParameterToPrimitiveType<{ type: "address"; name: "spender" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
}>;

export const FN_SELECTOR = "0x095ea7b3" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "spender",
  },
  {
    type: "uint256",
    name: "value",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `approve` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `approve` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isApproveSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = await isApproveSupported(contract);
 * ```
 */
export async function isApproveSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "approve" function.
 * @param options - The options for the approve function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeApproveParams } "thirdweb/extensions/erc20";
 * const result = encodeApproveParams({
 *  spender: ...,
 *  value: ...,
 * });
 * ```
 */
export function encodeApproveParams(options: ApproveParams) {
  return encodeAbiParameters(FN_INPUTS, [options.spender, options.value]);
}

/**
 * Encodes the "approve" function into a Hex string with its parameters.
 * @param options - The options for the approve function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeApprove } "thirdweb/extensions/erc20";
 * const result = encodeApprove({
 *  spender: ...,
 *  value: ...,
 * });
 * ```
 */
export function encodeApprove(options: ApproveParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeApproveParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "approve" function on the contract.
 * @param options - The options for the "approve" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { approve } from "thirdweb/extensions/erc20";
 *
 * const transaction = approve({
 *  contract,
 *  spender: ...,
 *  value: ...,
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
export function approve(
  options: BaseTransactionOptions<
    | ApproveParams
    | {
        asyncParams: () => Promise<ApproveParams>;
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
      return [resolvedOptions.spender, resolvedOptions.value] as const;
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
