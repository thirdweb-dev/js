import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "transfer" function.
 */

type TransferParamsInternal = {
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
};

export type TransferParams = Prettify<
  | TransferParamsInternal
  | {
      asyncParams: () => Promise<TransferParamsInternal>;
    }
>;
const FN_SELECTOR = "0xa9059cbb" as const;
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
 * ```
 * import { encodeTransferParams } "thirdweb/extensions/erc20";
 * const result = encodeTransferParams({
 *  to: ...,
 *  value: ...,
 * });
 * ```
 */
export function encodeTransferParams(options: TransferParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.to, options.value]);
}

/**
 * Calls the "transfer" function on the contract.
 * @param options - The options for the "transfer" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { transfer } from "thirdweb/extensions/erc20";
 *
 * const transaction = transfer({
 *  to: ...,
 *  value: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transfer(options: BaseTransactionOptions<TransferParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.to, resolvedParams.value] as const;
          }
        : [options.to, options.value],
  });
}
