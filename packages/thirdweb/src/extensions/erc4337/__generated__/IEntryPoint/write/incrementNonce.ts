import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "incrementNonce" function.
 */

type IncrementNonceParamsInternal = {
  key: AbiParameterToPrimitiveType<{ type: "uint192"; name: "key" }>;
};

export type IncrementNonceParams = Prettify<
  | IncrementNonceParamsInternal
  | {
      asyncParams: () => Promise<IncrementNonceParamsInternal>;
    }
>;
const FN_SELECTOR = "0x0bd28e3b" as const;
const FN_INPUTS = [
  {
    type: "uint192",
    name: "key",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "incrementNonce" function.
 * @param options - The options for the incrementNonce function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```
 * import { encodeIncrementNonceParams } "thirdweb/extensions/erc4337";
 * const result = encodeIncrementNonceParams({
 *  key: ...,
 * });
 * ```
 */
export function encodeIncrementNonceParams(
  options: IncrementNonceParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.key]);
}

/**
 * Calls the "incrementNonce" function on the contract.
 * @param options - The options for the "incrementNonce" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { incrementNonce } from "thirdweb/extensions/erc4337";
 *
 * const transaction = incrementNonce({
 *  key: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function incrementNonce(
  options: BaseTransactionOptions<IncrementNonceParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.key] as const;
          }
        : [options.key],
  });
}
