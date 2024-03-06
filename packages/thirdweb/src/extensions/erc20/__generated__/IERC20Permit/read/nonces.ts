import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "nonces" function.
 */
export type NoncesParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
};

/**
 * Calls the "nonces" function on the contract.
 * @param options - The options for the nonces function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```
 * import { nonces } from "thirdweb/extensions/erc20";
 *
 * const result = await nonces({
 *  owner: ...,
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
          name: "owner",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.owner],
  });
}
