import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "createAccount" function.
 */
export type CreateAccountParams = {
  admin: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "admin";
    type: "address";
  }>;
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "_data";
    type: "bytes";
  }>;
};

/**
 * Calls the createAccount function on the contract.
 * @param options - The options for the createAccount function.
 * @returns A prepared transaction object.
 * @extension IACCOUNTFACTORYCORE
 * @example
 * ```
 * import { createAccount } from "thirdweb/extensions/IAccountFactoryCore";
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
          internalType: "address",
          name: "admin",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
    ],
    params: [options.admin, options.data],
  });
}
