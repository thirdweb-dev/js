import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "register" function.
 */
export type RegisterParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
};

/**
 * Calls the register function on the contract.
 * @param options - The options for the register function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { register } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = register({
 *  registrant: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function register(options: BaseTransactionOptions<RegisterParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x4420e486",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.registrant],
  });
}
