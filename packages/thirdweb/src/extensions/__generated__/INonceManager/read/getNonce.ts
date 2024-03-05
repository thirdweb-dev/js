import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getNonce" function.
 */
export type GetNonceParams = {
  sender: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "sender";
    type: "address";
  }>;
  key: AbiParameterToPrimitiveType<{
    internalType: "uint192";
    name: "key";
    type: "uint192";
  }>;
};

/**
 * Calls the getNonce function on the contract.
 * @param options - The options for the getNonce function.
 * @returns The parsed result of the function call.
 * @extension INONCEMANAGER
 * @example
 * ```
 * import { getNonce } from "thirdweb/extensions/INonceManager";
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
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "uint192",
          name: "key",
          type: "uint192",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "nonce",
          type: "uint256",
        },
      ],
    ],
    params: [options.sender, options.key],
  });
}
