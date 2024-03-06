import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getNonce" function.
 */
export type GetNonceParams = {
  sender: AbiParameterToPrimitiveType<{ type: "address"; name: "sender" }>;
  key: AbiParameterToPrimitiveType<{ type: "uint192"; name: "key" }>;
};

/**
 * Calls the "getNonce" function on the contract.
 * @param options - The options for the getNonce function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```
 * import { getNonce } from "thirdweb/extensions/erc4337";
 *
 * const result = await getNonce({
 *  sender: ...,
 *  key: ...,
 * });
 *
 * ```
 */
export async function getNonce(
  options: BaseTransactionOptions<GetNonceParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x35567e1a",
      [
        {
          type: "address",
          name: "sender",
        },
        {
          type: "uint192",
          name: "key",
        },
      ],
      [
        {
          type: "uint256",
          name: "nonce",
        },
      ],
    ],
    params: [options.sender, options.key],
  });
}
