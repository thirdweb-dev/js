import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isRegistered" function.
 */
export type IsRegisteredParams = {
  addr: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "addr";
    type: "address";
  }>;
};

/**
 * Calls the isRegistered function on the contract.
 * @param options - The options for the isRegistered function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { isRegistered } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = isRegistered({
 *  addr: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function isRegistered(
  options: BaseTransactionOptions<IsRegisteredParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xc3c5a547",
      [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.addr],
  });
}
