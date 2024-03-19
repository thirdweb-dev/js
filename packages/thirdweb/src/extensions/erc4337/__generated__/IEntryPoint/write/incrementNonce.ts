import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

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
    method: [
      "0x0bd28e3b",
      [
        {
          type: "uint192",
          name: "key",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.key] as const;
      }

      return [options.key] as const;
    },
  });
}
