import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "transfer" function.
 */
export type TransferParams = WithValue<{
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
}>;

export const FN_SELECTOR = "0xa9059cbb" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "to",
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
 * Encodes the parameters for the "transfer" function.
 * @param options - The options for the transfer function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeTransferParams } "thirdweb/extensions/erc20";
 * const result = encodeTransferParams({
 *  to: ...,
 *  value: ...,
 * });
 * ```
 */
export function encodeTransferParams(options: TransferParams) {
  return encodeAbiParameters(FN_INPUTS, [options.to, options.value]);
}

/**
 * Calls the "transfer" function on the contract.
 * @param options - The options for the "transfer" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { transfer } from "thirdweb/extensions/erc20";
 *
 * const transaction = transfer({
 *  contract,
 *  to: ...,
 *  value: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
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
      const resolvedParams = await asyncOptions();
      return [resolvedParams.to, resolvedParams.value] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
