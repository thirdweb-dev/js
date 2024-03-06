import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "createAccount" function.
 */
export type CreateAccountParams = {
  admin: AbiParameterToPrimitiveType<{ type: "address"; name: "admin" }>;
  data: AbiParameterToPrimitiveType<{ type: "bytes"; name: "_data" }>;
};

/**
 * Calls the "createAccount" function on the contract.
 * @param options - The options for the "createAccount" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { createAccount } from "thirdweb/extensions/erc4337";
 *
 * const transaction = createAccount({
 *  admin: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createAccount(
  options: BaseTransactionOptions<CreateAccountParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xd8fd8f44",
      [
        {
          type: "address",
          name: "admin",
        },
        {
          type: "bytes",
          name: "_data",
        },
      ],
      [
        {
          type: "address",
          name: "account",
        },
      ],
    ],
    params: [options.admin, options.data],
  });
}
