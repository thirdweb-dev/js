import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isAdmin" function.
 */
export type IsAdminParams = {
  signer: AbiParameterToPrimitiveType<{ type: "address"; name: "signer" }>;
};

/**
 * Calls the "isAdmin" function on the contract.
 * @param options - The options for the isAdmin function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```
 * import { isAdmin } from "thirdweb/extensions/erc4337";
 *
 * const result = await isAdmin({
 *  signer: ...,
 * });
 *
 * ```
 */
export async function isAdmin(options: BaseTransactionOptions<IsAdminParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x24d7806c",
      [
        {
          type: "address",
          name: "signer",
        },
      ],
      [
        {
          type: "bool",
        },
      ],
    ],
    params: [options.signer],
  });
}
