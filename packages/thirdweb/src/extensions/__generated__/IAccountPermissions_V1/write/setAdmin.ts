import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setAdmin" function.
 */
export type SetAdminParams = {
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
  isAdmin: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "isAdmin";
    type: "bool";
  }>;
};

/**
 * Calls the setAdmin function on the contract.
 * @param options - The options for the setAdmin function.
 * @returns A prepared transaction object.
 * @extension IACCOUNTPERMISSIONS_V1
 * @example
 * ```
 * import { setAdmin } from "thirdweb/extensions/IAccountPermissions_V1";
 *
 * const transaction = setAdmin({
 *  account: ...,
 *  isAdmin: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setAdmin(options: BaseTransactionOptions<SetAdminParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x4b0bddd2",
      [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "bool",
          name: "isAdmin",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.account, options.isAdmin],
  });
}
