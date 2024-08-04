import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "multicall" function.
 */

export type MulticallParams = {
  data: AbiParameterToPrimitiveType<{
    name: "data";
    type: "bytes[]";
    internalType: "bytes[]";
  }>;
};

const FN_SELECTOR = "0xac9650d8" as const;
const FN_INPUTS = [
  {
    name: "data",
    type: "bytes[]",
    internalType: "bytes[]",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "bytes[]",
    internalType: "bytes[]",
  },
] as const;

/**
 * Encodes the parameters for the "multicall" function.
 * @param options - The options for the multicall function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeMulticallParams } "thirdweb/extensions/hooks";
 * const result = encodeMulticallParams({
 *  data: ...,
 * });
 * ```
 */
export function encodeMulticallParams(options: MulticallParams) {
  return encodeAbiParameters(FN_INPUTS, [options.data]);
}

/**
 * Calls the "multicall" function on the contract.
 * @param options - The options for the "multicall" function.
 * @returns A prepared transaction object.
 * @extension HOOKS
 * @example
 * ```ts
 * import { multicall } from "thirdweb/extensions/hooks";
 *
 * const transaction = multicall({
 *  contract,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function multicall(
  options: BaseTransactionOptions<
    | MulticallParams
    | {
        asyncParams: () => Promise<MulticallParams>;
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
            return [resolvedParams.data] as const;
          }
        : [options.data],
  });
}
