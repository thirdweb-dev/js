import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "enableFeeAmount" function.
 */

type EnableFeeAmountParamsInternal = {
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
  tickSpacing: AbiParameterToPrimitiveType<{
    type: "int24";
    name: "tickSpacing";
  }>;
};

export type EnableFeeAmountParams = Prettify<
  | EnableFeeAmountParamsInternal
  | {
      asyncParams: () => Promise<EnableFeeAmountParamsInternal>;
    }
>;
const FN_SELECTOR = "0x8a7c195f" as const;
const FN_INPUTS = [
  {
    type: "uint24",
    name: "fee",
  },
  {
    type: "int24",
    name: "tickSpacing",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "enableFeeAmount" function.
 * @param options - The options for the enableFeeAmount function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```
 * import { encodeEnableFeeAmountParams } "thirdweb/extensions/uniswap";
 * const result = encodeEnableFeeAmountParams({
 *  fee: ...,
 *  tickSpacing: ...,
 * });
 * ```
 */
export function encodeEnableFeeAmountParams(
  options: EnableFeeAmountParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.fee, options.tickSpacing]);
}

/**
 * Calls the "enableFeeAmount" function on the contract.
 * @param options - The options for the "enableFeeAmount" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```
 * import { enableFeeAmount } from "thirdweb/extensions/uniswap";
 *
 * const transaction = enableFeeAmount({
 *  fee: ...,
 *  tickSpacing: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function enableFeeAmount(
  options: BaseTransactionOptions<EnableFeeAmountParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.fee, resolvedParams.tickSpacing] as const;
          }
        : [options.fee, options.tickSpacing],
  });
}
