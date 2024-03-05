import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "unregister" function.
 */
export type UnregisterParams = {
  addr: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "addr";
    type: "address";
  }>;
};

/**
 * Calls the unregister function on the contract.
 * @param options - The options for the unregister function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { unregister } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = unregister({
 *  addr: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function unregister(options: BaseTransactionOptions<UnregisterParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x2ec2c246",
      [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.addr],
  });
}
