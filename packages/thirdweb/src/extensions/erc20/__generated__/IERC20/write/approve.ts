import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

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
 * Calls the "approve" function on the contract.
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
  });
}
