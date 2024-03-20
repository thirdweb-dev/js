import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "nonces" function.
 */
export type NoncesParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

/**
 * Calls the "nonces" function on the contract.
 * @param options - The options for the nonces function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { nonces } from "thirdweb/extensions/farcaster";
 *
 * const result = await nonces({
 *  account: ...,
 * });
 *
 * ```
 */
export async function nonces(options: BaseTransactionOptions<NoncesParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x7ecebe00",
      [
        {
          type: "address",
          name: "account",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.account],
  });
}
