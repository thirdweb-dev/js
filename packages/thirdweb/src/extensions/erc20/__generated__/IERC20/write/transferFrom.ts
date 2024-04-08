import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "transferFrom" function.
 */

export type TransferFromParams = {
  from: AbiParameterToPrimitiveType<{ type: "address"; name: "from" }>;
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
};

export const FN_SELECTOR = "0x23b872dd" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "from",
  },
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
 * Encodes the parameters for the "transferFrom" function.
 * @param options - The options for the transferFrom function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeTransferFromParams } "thirdweb/extensions/erc20";
 * const result = encodeTransferFromParams({
 *  from: ...,
 *  to: ...,
 *  value: ...,
 * });
 * ```
 */
export function encodeTransferFromParams(options: TransferFromParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.from,
    options.to,
    options.value,
  ]);
}

/**
 * Calls the "transferFrom" function on the contract.
 * @param options - The options for the "transferFrom" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { transferFrom } from "thirdweb/extensions/erc20";
 *
 * const transaction = transferFrom({
 *  contract,
 *  from: ...,
 *  to: ...,
 *  value: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferFrom(
  options: BaseTransactionOptions<
    | TransferFromParams
    | {
        asyncParams: () => Promise<TransferFromParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.from,
              resolvedParams.to,
              resolvedParams.value,
            ] as const;
          }
        : [options.from, options.to, options.value],
  });
}
