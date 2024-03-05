import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "subscribers" function.
 */
export type SubscribersParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
};

/**
 * Calls the subscribers function on the contract.
 * @param options - The options for the subscribers function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { subscribers } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = subscribers({
 *  registrant: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function subscribers(
  options: BaseTransactionOptions<SubscribersParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x5745ae28",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
      ],
      [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
    ],
    params: [options.registrant],
  });
}
